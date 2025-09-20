# AdminIOUApi

All URIs are relative to *http://localhost:3000*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiAdminIouBatchIssuePost**](#apiadminioubatchissuepost) | **POST** /api/admin/iou/batch-issue | 대량 IOU 발행|
|[**apiAdminIouBatchProcessSwapPost**](#apiadminioubatchprocessswappost) | **POST** /api/admin/iou/batch-process-swap | 대량 스왑 처리|
|[**apiAdminIouCalculateFeePost**](#apiadminioucalculatefeepost) | **POST** /api/admin/iou/calculate-fee | 수수료 계산 (관리자용)|
|[**apiAdminIouIssuePost**](#apiadminiouissuepost) | **POST** /api/admin/iou/issue | KRW IOU 직접 발행|
|[**apiAdminIouProcessSwapPost**](#apiadminiouprocessswappost) | **POST** /api/admin/iou/process-swap | 외부 스왑 처리 후 IOU 발행|
|[**apiAdminIouSettingsGet**](#apiadminiousettingsget) | **GET** /api/admin/iou/settings | IOU 설정 정보 조회|
|[**apiAdminIouTotalIssuedGet**](#apiadminioutotalissuedget) | **GET** /api/admin/iou/total-issued | 총 발행된 IOU 수량 조회|

# **apiAdminIouBatchIssuePost**
> apiAdminIouBatchIssuePost(apiAdminIouBatchIssuePostRequest)


### Example

```typescript
import {
    AdminIOUApi,
    Configuration,
    ApiAdminIouBatchIssuePostRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminIOUApi(configuration);

let apiAdminIouBatchIssuePostRequest: ApiAdminIouBatchIssuePostRequest; //

const { status, data } = await apiInstance.apiAdminIouBatchIssuePost(
    apiAdminIouBatchIssuePostRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **apiAdminIouBatchIssuePostRequest** | **ApiAdminIouBatchIssuePostRequest**|  | |


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
|**200** | 대량 발행 처리 결과 |  -  |
|**403** | 관리자 권한 없음 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiAdminIouBatchProcessSwapPost**
> apiAdminIouBatchProcessSwapPost(apiAdminIouBatchProcessSwapPostRequest)


### Example

```typescript
import {
    AdminIOUApi,
    Configuration,
    ApiAdminIouBatchProcessSwapPostRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminIOUApi(configuration);

let apiAdminIouBatchProcessSwapPostRequest: ApiAdminIouBatchProcessSwapPostRequest; //

const { status, data } = await apiInstance.apiAdminIouBatchProcessSwapPost(
    apiAdminIouBatchProcessSwapPostRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **apiAdminIouBatchProcessSwapPostRequest** | **ApiAdminIouBatchProcessSwapPostRequest**|  | |


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
|**200** | 대량 스왑 처리 결과 |  -  |
|**403** | 관리자 권한 없음 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiAdminIouCalculateFeePost**
> apiAdminIouCalculateFeePost(apiAdminIouCalculateFeePostRequest)


### Example

```typescript
import {
    AdminIOUApi,
    Configuration,
    ApiAdminIouCalculateFeePostRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminIOUApi(configuration);

let apiAdminIouCalculateFeePostRequest: ApiAdminIouCalculateFeePostRequest; //

const { status, data } = await apiInstance.apiAdminIouCalculateFeePost(
    apiAdminIouCalculateFeePostRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **apiAdminIouCalculateFeePostRequest** | **ApiAdminIouCalculateFeePostRequest**|  | |


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
|**200** | 수수료 계산 성공 |  -  |
|**403** | 관리자 권한 없음 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiAdminIouIssuePost**
> apiAdminIouIssuePost(apiAdminIouIssuePostRequest)


### Example

```typescript
import {
    AdminIOUApi,
    Configuration,
    ApiAdminIouIssuePostRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminIOUApi(configuration);

let apiAdminIouIssuePostRequest: ApiAdminIouIssuePostRequest; //

const { status, data } = await apiInstance.apiAdminIouIssuePost(
    apiAdminIouIssuePostRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **apiAdminIouIssuePostRequest** | **ApiAdminIouIssuePostRequest**|  | |


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
|**200** | IOU 발행 성공 |  -  |
|**403** | 관리자 권한 없음 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiAdminIouProcessSwapPost**
> apiAdminIouProcessSwapPost(apiAdminIouProcessSwapPostRequest)


### Example

```typescript
import {
    AdminIOUApi,
    Configuration,
    ApiAdminIouProcessSwapPostRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminIOUApi(configuration);

let apiAdminIouProcessSwapPostRequest: ApiAdminIouProcessSwapPostRequest; //

const { status, data } = await apiInstance.apiAdminIouProcessSwapPost(
    apiAdminIouProcessSwapPostRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **apiAdminIouProcessSwapPostRequest** | **ApiAdminIouProcessSwapPostRequest**|  | |


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
|**200** | 스왑 처리 및 IOU 발행 성공 |  -  |
|**403** | 관리자 권한 없음 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiAdminIouSettingsGet**
> apiAdminIouSettingsGet()


### Example

```typescript
import {
    AdminIOUApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminIOUApi(configuration);

const { status, data } = await apiInstance.apiAdminIouSettingsGet();
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
|**200** | 설정 정보 조회 성공 |  -  |
|**403** | 관리자 권한 없음 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiAdminIouTotalIssuedGet**
> apiAdminIouTotalIssuedGet()


### Example

```typescript
import {
    AdminIOUApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminIOUApi(configuration);

const { status, data } = await apiInstance.apiAdminIouTotalIssuedGet();
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
|**200** | 총 발행량 조회 성공 |  -  |
|**403** | 관리자 권한 없음 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

