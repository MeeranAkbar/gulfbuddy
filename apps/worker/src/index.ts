export interface WorkerModule {
  key: string;
  description: string;
}

export const workerModules: WorkerModule[] = [
  { key: 'ai', description: 'Proxy and guard third-party AI calls.' },
  { key: 'security', description: 'CAPTCHA, OTP, and abuse checks.' },
  { key: 'integrations', description: 'CRM, payment, and permit verification hooks.' },
  { key: 'schedulers', description: 'Expiry jobs, campaign windows, and maintenance actions.' },
  { key: 'webhooks', description: 'Inbound webhooks with signature verification.' }
];
