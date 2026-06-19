import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHealth() {
    return {
      app: 'Angel Done',
      status: 'running',
      version: '1.0.0',
    };
  }
}