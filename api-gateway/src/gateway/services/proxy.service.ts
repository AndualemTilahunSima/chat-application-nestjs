import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import type { Request } from 'express';

@Injectable()
export class ProxyService {
  private readonly logger = new Logger(ProxyService.name);
  private readonly userServiceUrl: string;
  private readonly storageServiceUrl: string;
  private readonly messagingServiceUrl: string;
  private readonly axiosInstance: AxiosInstance;

  constructor() {
    this.userServiceUrl = process.env.USER_SERVICE_URL || 'http://localhost:3000';
    this.storageServiceUrl = process.env.STORAGE_SERVICE_URL || 'http://localhost:3002';
    this.messagingServiceUrl = process.env.MESSAGING_SERVICE_URL || 'http://localhost:3003';

    this.axiosInstance = axios.create({
      timeout: 30000,
    });

    // Add request interceptor for logging
    this.axiosInstance.interceptors.request.use(
      (config) => {
        this.logger.debug(`Proxying ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        this.logger.error('Proxy request error', error);
        return Promise.reject(error);
      },
    );

    // Add response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        this.logger.error(`Proxy error: ${error.message}`, error.response?.data);
        throw new HttpException(
          error.response?.data || error.message || 'Internal server error',
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      },
    );
  }

  async proxyRequest(
    method: string,
    path: string,
    headers: Record<string, string>,
    body?: any,
    query?: Record<string, any>,
  ): Promise<any> {
    // Determine which service to route to
    const isStorageRoute = path.startsWith('/storage');
    const isMessagingRoute = path.startsWith('/messaging');
    let baseURL: string;
    
    if (isStorageRoute) {
      baseURL = this.storageServiceUrl;
    } else if (isMessagingRoute) {
      baseURL = this.messagingServiceUrl;
    } else {
      baseURL = this.userServiceUrl;
    }

    const isFileUpload = body && typeof body === 'object' && 'pipe' in body;

    const config: AxiosRequestConfig = {
      method: method.toLowerCase() as any,
      url: `${baseURL}${path}`,
      headers: {
        ...headers,
        // Remove host and connection headers that shouldn't be forwarded
        host: undefined,
        connection: undefined,
      },
      params: query,
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    };

    // Handle file uploads by streaming the request
    if (isFileUpload && body instanceof Request) {
      config.data = body;
      // Don't set Content-Type, let axios determine it from the stream
      if (config.headers) {
        delete config.headers['content-type'];
      }

    } else {
      config.data = body;
    }

    try {
      const response = await this.axiosInstance.request(config);
      return response.data;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error('Unexpected proxy error', error);
      let serviceName = 'user service';
      if (isStorageRoute) serviceName = 'storage service';
      else if (isMessagingRoute) serviceName = 'messaging service';
      throw new HttpException(
        `Failed to proxy request to ${serviceName}`,
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}

