---
title: Anonymous Analytics
---

## Anonymous Analytics

OptunaHub uses Google Analytics to collect anonymous usage data. This data is used to improve the service and is not shared with any third parties. You can opt-out of the collection of this data. See the last section of this document for instructions on how to opt-out.

### What data is collected?

We collect the following data:
- If the running environment is CI or not.
- The version of the Optuna.
- The version of the OptunaHub.
- The name of the used package in the OptunaHub.
- The git hash of the used package in the OptunaHub Registry, if the package is from the OptunaHub Registry.
- The region of the user. This is automatically detected by Google Analytics.

### How is the data used?

The data is used to improve the service. For example, we use the data to understand which features are used most frequently and which features are not used at all. This helps us to prioritize the development of new features and to improve existing features. The data is not shared with any third parties.

### How to opt-out

Youn can opt-out of the anonymous analytics in the following ways.

- By setting the environment variable `OPTUNAHUB_NO_ANALYTICS` to `1`

```shell
export OPTUNAHUB_NO_ANALYTICS=1
```
