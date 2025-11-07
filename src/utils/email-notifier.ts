/**
 * Shared Email Notification Utility
 * Sends email notifications using Resend API
 */

export interface EmailNotificationRequest {
  appName: string;
  environment: string;
  errorType: string;
  errorMessage: string;
  timestamp: string;
  additionalInfo?: any;
}

export interface EmailNotificationConfig {
  resendApiKey: string;
  fromEmail: string;
  toEmail: string;
}

export class EmailNotifier {
  private config: EmailNotificationConfig;

  constructor(config: EmailNotificationConfig) {
    this.config = config;
  }

  async sendBootstrapErrorNotification(request: EmailNotificationRequest): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const htmlBody = this.generateBootstrapErrorEmailHTML(request);
      const textBody = this.generateBootstrapErrorEmailText(request);

      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: this.config.fromEmail,
          to: [this.config.toEmail],
          subject: `🚨 ${request.appName} - Bootstrap Failure Alert`,
          html: htmlBody,
          text: textBody,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Resend API error: ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      return {
        success: true,
        messageId: data.id
      };
    } catch (error: any) {
      console.error('Failed to send email notification:', error);
      return {
        success: false,
        error: error.message || 'Unknown error'
      };
    }
  }

  private generateBootstrapErrorEmailHTML(request: EmailNotificationRequest): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc3545; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .header h1 { margin: 0; font-size: 24px; }
          .content { background: #f8f9fa; padding: 20px; border: 1px solid #dee2e6; }
          .info-row { margin: 10px 0; padding: 10px; background: white; border-left: 4px solid #dc3545; }
          .label { font-weight: bold; color: #495057; }
          .value { color: #212529; margin-top: 5px; }
          .code { background: #e9ecef; padding: 10px; border-radius: 4px; font-family: monospace; margin-top: 10px; overflow-x: auto; }
          .footer { background: #e9ecef; padding: 15px; text-align: center; font-size: 12px; color: #6c757d; border-radius: 0 0 8px 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚨 Bootstrap Failure Alert</h1>
          </div>
          <div class="content">
            <div class="info-row">
              <div class="label">Application:</div>
              <div class="value">${this.escapeHtml(request.appName)}</div>
            </div>
            <div class="info-row">
              <div class="label">Environment:</div>
              <div class="value">${this.escapeHtml(request.environment)}</div>
            </div>
            <div class="info-row">
              <div class="label">Error Type:</div>
              <div class="value">${this.escapeHtml(request.errorType)}</div>
            </div>
            <div class="info-row">
              <div class="label">Timestamp:</div>
              <div class="value">${this.escapeHtml(request.timestamp)}</div>
            </div>
            <div class="info-row">
              <div class="label">Error Message:</div>
              <div class="value code">${this.escapeHtml(request.errorMessage)}</div>
            </div>
            ${request.additionalInfo ? `
            <div class="info-row">
              <div class="label">Additional Information:</div>
              <div class="value code">${this.escapeHtml(JSON.stringify(request.additionalInfo, null, 2))}</div>
            </div>
            ` : ''}
          </div>
          <div class="footer">
            <p>This is an automated notification from the ${this.escapeHtml(request.appName)} monitoring system.</p>
            <p>Please investigate and resolve the issue as soon as possible.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateBootstrapErrorEmailText(request: EmailNotificationRequest): string {
    let text = `
🚨 Bootstrap Failure Alert

Application: ${request.appName}
Environment: ${request.environment}
Error Type: ${request.errorType}
Timestamp: ${request.timestamp}

Error Message:
${request.errorMessage}
`;

    if (request.additionalInfo) {
      text += `\nAdditional Information:\n${JSON.stringify(request.additionalInfo, null, 2)}`;
    }

    text += `\n\n---\nThis is an automated notification from the ${request.appName} monitoring system.
Please investigate and resolve the issue as soon as possible.`;

    return text;
  }

  private escapeHtml(unsafe: string): string {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}

/**
 * Helper function for quick email sending
 */
export async function sendBootstrapErrorEmail(
  config: EmailNotificationConfig,
  request: EmailNotificationRequest
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const notifier = new EmailNotifier(config);
  return notifier.sendBootstrapErrorNotification(request);
}

