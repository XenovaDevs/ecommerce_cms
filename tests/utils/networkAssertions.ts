import { expect, type Page } from '@playwright/test';
import { E2E_ENV } from './env';

type IssueType = 'http' | 'failed-request' | 'console';

export interface NetworkIssue {
  type: IssueType;
  url: string;
  detail: string;
}

export interface NetworkMonitor {
  stop: () => { issues: NetworkIssue[] };
}

interface IssueMatcher {
  type?: IssueType;
  url?: RegExp;
  detail?: RegExp;
}

interface CriticalIssueOptions {
  ignore?: IssueMatcher[];
}

export function attachNetworkMonitor(page: Page): NetworkMonitor {
  const issues: NetworkIssue[] = [];
  const isExternalFontRequest = (url: string): boolean =>
    url.includes('fonts.gstatic.com') || url.includes('fonts.googleapis.com');

  const onResponse = (response: any) => {
    const url = response.url();
    const status = response.status();
    const isApi = url.includes('/api/v1/');

    if (status >= 500) {
      issues.push({ type: 'http', url, detail: `status ${status}` });
      return;
    }

    if (E2E_ENV.strictApi && isApi && (status === 404 || status === 405)) {
      issues.push({ type: 'http', url, detail: `status ${status}` });
    }
  };

  const onFailed = (request: any) => {
    const url = request.url();
    const errorText = request.failure()?.errorText || 'requestfailed';
    if (url.startsWith('data:')) {
      return;
    }
    if (isExternalFontRequest(url)) {
      return;
    }
    if (errorText.includes('ERR_ABORTED')) {
      return;
    }
    issues.push({
      type: 'failed-request',
      url,
      detail: errorText,
    });
  };

  const onConsole = (msg: any) => {
    if (msg.type() !== 'error') {
      return;
    }
    const message = msg.text();
    if (message.startsWith('Warning:')) {
      return;
    }
    if (message.includes('ERR_CONNECTION_RESET')) {
      return;
    }
    issues.push({
      type: 'console',
      url: page.url(),
      detail: message,
    });
  };

  page.on('response', onResponse);
  page.on('requestfailed', onFailed);
  page.on('console', onConsole);

  return {
    stop: () => {
      page.off('response', onResponse);
      page.off('requestfailed', onFailed);
      page.off('console', onConsole);
      return { issues };
    },
  };
}

function matches(issue: NetworkIssue, matcher: IssueMatcher): boolean {
  if (matcher.type && issue.type !== matcher.type) {
    return false;
  }

  if (matcher.url && !matcher.url.test(issue.url)) {
    return false;
  }

  if (matcher.detail && !matcher.detail.test(issue.detail)) {
    return false;
  }

  return true;
}

export function expectNoCriticalClientIssues(
  report: { issues: NetworkIssue[] },
  context: string,
  options: CriticalIssueOptions = {}
): void {
  const ignoreMatchers = options.ignore ?? [];
  const criticalIssues = report.issues.filter((issue) => {
    return !ignoreMatchers.some((matcher) => matches(issue, matcher));
  });

  expect(criticalIssues, `Unexpected client/network errors while testing ${context}`).toEqual([]);
}
