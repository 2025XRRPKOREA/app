# AdminDomainApi

All URIs are relative to *http://localhost:3000*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiAdminDomainBlacklistAddPost**](#apiadmindomainblacklistaddpost) | **POST** /api/admin/domain/blacklist/add | 블랙리스트에 사용자 추가|
|[**apiAdminDomainBlacklistGet**](#apiadmindomainblacklistget) | **GET** /api/admin/domain/blacklist | 블랙리스트 목록 조회|
|[**apiAdminDomainCheckPermissionPost**](#apiadmindomaincheckpermissionpost) | **POST** /api/admin/domain/check-permission | 특정 사용자의 Trust Line 권한 확인|
|[**apiAdminDomainKycBatchUpdatePost**](#apiadmindomainkycbatchupdatepost) | **POST** /api/admin/domain/kyc/batch-update | 대량 KYC 상태 업데이트|
|[**apiAdminDomainKycUpdatePost**](#apiadmindomainkycupdatepost) | **POST** /api/admin/domain/kyc/update | 사용자의 KYC 상태 업데이트|
|[**apiAdminDomainSettingsGet**](#apiadmindomainsettingsget) | **GET** /api/admin/domain/settings | Domain 설정 조회|
|[**apiAdminDomainSettingsPut**](#apiadmindomainsettingsput) | **PUT** /api/admin/domain/settings | Domain 설정 업데이트|
|[**apiAdminDomainStatsGet**](#apiadmindomainstatsget) | **GET** /api/admin/domain/stats | Domain 통계 정보 조회|
|[**apiAdminDomainWhitelistAddPost**](#apiadmindomainwhitelistaddpost) | **POST** /api/admin/domain/whitelist/add | 화이트리스트에 사용자 추가|
|[**apiAdminDomainWhitelistBatchAddPost**](#apiadmindomainwhitelistbatchaddpost) | **POST** /api/admin/domain/whitelist/batch-add | 대량 화이트리스트 추가|
|[**apiAdminDomainWhitelistGet**](#apiadmindomainwhitelistget) | **GET** /api/admin/domain/whitelist | 화이트리스트 목록 조회|

# **apiAdminDomainBlacklistAddPost**
> apiAdminDomainBlacklistAddPost(apiAdminDomainBlacklistAddPostRequest)


### Example

```typescript
import {
    AdminDomainApi,
    Configuration,
    ApiAdminDomainBlacklistAddPostRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminDomainApi(configuration);

let apiAdminDomainBlacklistAddPostRequest: ApiAdminDomainBlacklistAddPostRequest; //

const { status, data } = await apiInstance.apiAdminDomainBlacklistAddPost(
    apiAdminDomainBlacklistAddPostRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **apiAdminDomainBlacklistAddPostRequest** | **ApiAdminDomainBlacklistAddPostRequest**|  | |


### Return type

void (empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 블랙리스트 추가 성공 |  -  |
|**403** | 관리자 권한 없음 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiAdminDomainBlacklistGet**
> apiAdminDomainBlacklistGet()


### Example

```typescript
import {
    AdminDomainApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminDomainApi(configuration);

let page: number; // (optional) (default to 1)
let limit: number; // (optional) (default to 20)

const { status, data } = await apiInstance.apiAdminDomainBlacklistGet(
    page,
    limit
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] |  | (optional) defaults to 1|
| **limit** | [**number**] |  | (optional) defaults to 20|


### Return type

void (empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 블랙리스트 조회 성공 |  -  |
|**403** | 관리자 권한 없음 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiAdminDomainCheckPermissionPost**
> apiAdminDomainCheckPermissionPost(apiAdminDomainCheckPermissionPostRequest)


### Example

```typescript
import {
    AdminDomainApi,
    Configuration,
    ApiAdminDomainCheckPermissionPostRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminDomainApi(configuration);

let apiAdminDomainCheckPermissionPostRequest: ApiAdminDomainCheckPermissionPostRequest; //

const { status, data } = await apiInstance.apiAdminDomainCheckPermissionPost(
    apiAdminDomainCheckPermissionPostRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **apiAdminDomainCheckPermissionPostRequest** | **ApiAdminDomainCheckPermissionPostRequest**|  | |


### Return type

void (empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 권한 확인 성공 |  -  |
|**403** | 관리자 권한 없음 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiAdminDomainKycBatchUpdatePost**
> apiAdminDomainKycBatchUpdatePost(apiAdminDomainKycBatchUpdatePostRequest)


### Example

```typescript
import {
    AdminDomainApi,
    Configuration,
    ApiAdminDomainKycBatchUpdatePostRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminDomainApi(configuration);

let apiAdminDomainKycBatchUpdatePostRequest: ApiAdminDomainKycBatchUpdatePostRequest; //

const { status, data } = await apiInstance.apiAdminDomainKycBatchUpdatePost(
    apiAdminDomainKycBatchUpdatePostRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **apiAdminDomainKycBatchUpdatePostRequest** | **ApiAdminDomainKycBatchUpdatePostRequest**|  | |


### Return type

void (empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 대량 처리 결과 |  -  |
|**403** | 관리자 권한 없음 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiAdminDomainKycUpdatePost**
> apiAdminDomainKycUpdatePost(apiAdminDomainKycUpdatePostRequest)


### Example

```typescript
import {
    AdminDomainApi,
    Configuration,
    ApiAdminDomainKycUpdatePostRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminDomainApi(configuration);

let apiAdminDomainKycUpdatePostRequest: ApiAdminDomainKycUpdatePostRequest; //

const { status, data } = await apiInstance.apiAdminDomainKycUpdatePost(
    apiAdminDomainKycUpdatePostRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **apiAdminDomainKycUpdatePostRequest** | **ApiAdminDomainKycUpdatePostRequest**|  | |


### Return type

void (empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | KYC 상태 업데이트 성공 |  -  |
|**403** | 관리자 권한 없음 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiAdminDomainSettingsGet**
> apiAdminDomainSettingsGet()


### Example

```typescript
import {
    AdminDomainApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminDomainApi(configuration);

const { status, data } = await apiInstance.apiAdminDomainSettingsGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

void (empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Domain 설정 조회 성공 |  -  |
|**403** | 관리자 권한 없음 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiAdminDomainSettingsPut**
> apiAdminDomainSettingsPut(apiAdminDomainSettingsPutRequest)


### Example

```typescript
import {
    AdminDomainApi,
    Configuration,
    ApiAdminDomainSettingsPutRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminDomainApi(configuration);

let apiAdminDomainSettingsPutRequest: ApiAdminDomainSettingsPutRequest; //

const { status, data } = await apiInstance.apiAdminDomainSettingsPut(
    apiAdminDomainSettingsPutRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **apiAdminDomainSettingsPutRequest** | **ApiAdminDomainSettingsPutRequest**|  | |


### Return type

void (empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Domain 설정 업데이트 성공 |  -  |
|**403** | 관리자 권한 없음 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiAdminDomainStatsGet**
> apiAdminDomainStatsGet()


### Example

```typescript
import {
    AdminDomainApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminDomainApi(configuration);

const { status, data } = await apiInstance.apiAdminDomainStatsGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

void (empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 통계 조회 성공 |  -  |
|**403** | 관리자 권한 없음 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiAdminDomainWhitelistAddPost**
> apiAdminDomainWhitelistAddPost(apiAdminDomainWhitelistAddPostRequest)


### Example

```typescript
import {
    AdminDomainApi,
    Configuration,
    ApiAdminDomainWhitelistAddPostRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminDomainApi(configuration);

let apiAdminDomainWhitelistAddPostRequest: ApiAdminDomainWhitelistAddPostRequest; //

const { status, data } = await apiInstance.apiAdminDomainWhitelistAddPost(
    apiAdminDomainWhitelistAddPostRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **apiAdminDomainWhitelistAddPostRequest** | **ApiAdminDomainWhitelistAddPostRequest**|  | |


### Return type

void (empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 화이트리스트 추가 성공 |  -  |
|**403** | 관리자 권한 없음 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiAdminDomainWhitelistBatchAddPost**
> apiAdminDomainWhitelistBatchAddPost(apiAdminDomainWhitelistBatchAddPostRequest)


### Example

```typescript
import {
    AdminDomainApi,
    Configuration,
    ApiAdminDomainWhitelistBatchAddPostRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminDomainApi(configuration);

let apiAdminDomainWhitelistBatchAddPostRequest: ApiAdminDomainWhitelistBatchAddPostRequest; //

const { status, data } = await apiInstance.apiAdminDomainWhitelistBatchAddPost(
    apiAdminDomainWhitelistBatchAddPostRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **apiAdminDomainWhitelistBatchAddPostRequest** | **ApiAdminDomainWhitelistBatchAddPostRequest**|  | |


### Return type

void (empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 대량 처리 결과 |  -  |
|**403** | 관리자 권한 없음 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiAdminDomainWhitelistGet**
> apiAdminDomainWhitelistGet()


### Example

```typescript
import {
    AdminDomainApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminDomainApi(configuration);

let page: number; // (optional) (default to 1)
let limit: number; // (optional) (default to 20)

const { status, data } = await apiInstance.apiAdminDomainWhitelistGet(
    page,
    limit
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] |  | (optional) defaults to 1|
| **limit** | [**number**] |  | (optional) defaults to 20|


### Return type

void (empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 화이트리스트 조회 성공 |  -  |
|**403** | 관리자 권한 없음 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

