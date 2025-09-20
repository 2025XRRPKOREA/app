# AdminDomainApi

All URIs are relative to *http://localhost:3000*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiAdminDomainSettingsGet**](#apiadmindomainsettingsget) | **GET** /api/admin/domain/settings | Domain 설정 조회|
|[**apiAdminDomainSettingsPut**](#apiadmindomainsettingsput) | **PUT** /api/admin/domain/settings | Domain 설정 업데이트|

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

