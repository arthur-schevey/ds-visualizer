import { notification } from 'antd';

export const notify = {
  copy: () =>
    notification.success({
      message: "Copied to clipboard",
      duration: 1.5,
    }),

  copyErr: (err: Error) =>
    notification.error({
      message: "Error copying to clipboard",
      description: "Error:" + err.message,
      showProgress: true,
      duration: 4,
    }),

  download: () =>
    notification.success({
      message: "Downloaded data as .txt file",
      duration: 1.5,
    }),

  // App-specific cases

  // In the event the user attempts to use non-numeric tree node values in the "Leetcode" format
  leetcodeWarn: () =>
    notification.warning({
      message: "Format changed",
      description:
        "LeetCode strings do not support non-numeric node values so your format has been automatically switched to allow quotes. If you want to return to the standard LeetCode format, remove any non-numeric values.",
      showProgress: true,
      duration: 9,
    }),
};