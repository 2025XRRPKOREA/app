# AdminSwapConfigApi

All URIs are relative to *http://localhost:3000*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiAdminSwapFeeBatchCreatePost**](#apiadminswapfeebatchcreatepost) | **POST** /api/admin/swap-fee/batch-create | 대량 수수료 설정 생성|
|[**apiAdminSwapFeeCalculatePost**](#apiadminswapfeecalculatepost) | **POST** /api/admin/swap-fee/calculate | 수수료 계산 시뮬레이션|
|[**apiAdminSwapFeeConfigsGet**](#apiadminswapfeeconfigsget) | **GET** /api/admin/swap-fee/configs | 모든 수수료 설정 조회|
|[**apiAdminSwapFeeConfigsIdDeactivatePost**](#apiadminswapfeeconfigsiddeactivatepost) | **POST** /api/admin/swap-fee/configs/{id}/deactivate | 수수료 설정 비활성화|
|[**apiAdminSwapFeeConfigsIdGet**](#apiadminswapfeeconfigsidget) | **GET** /api/admin/swap-fee/configs/{id} | 특정 수수료 설정 조회|
|[**apiAdminSwapFeeConfigsIdPut**](#apiadminswapfeeconfigsidput) | **PUT** /api/admin/swap-fee/configs/{id} | 수수료 설정 업데이트|
|[**apiAdminSwapFeeConfigsPost**](#apiadminswapfeeconfigspost) | **POST** /api/admin/swap-fee/configs | 새 수수료 설정 생성|
|[**apiAdminSwapFeeCurrentSwapTypeGet**](#apiadminswapfeecurrentswaptypeget) | **GET** /api/admin/swap-fee/current/{swapType} | 현재 활성화된 수수료 설정 조회|
|[**apiAdminSwapFeeStatsGet**](#apiadminswapfeestatsget) | **GET** /api/admin/swap-fee/stats | 수수료 설정 통계 조회|

# **apiAdminSwapFeeBatchCreatePost**
> apiAdminSwapFeeBatchCreatePost(apiAdminSwapFeeBatchCreatePostRequest)


### Example

```typescript
import {
    AdminSwapConfigApi,
    Configuration,
    ApiAdminSwapFeeBatchCreatePostRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminSwapConfigApi(configuration);

let apiAdminSwapFeeBatchCreatePostRequest: ApiAdminSwapFeeBatchCreatePostRequest; //

const { status, data } = await apiInstance.apiAdminSwapFeeBatchCreatePost(
    apiAdminSwapFeeBatchCreatePostRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **apiAdminSwapFeeBatchCreatePostRequest** | **ApiAdminSwapFeeBatchCreatePostRequest**|  | |


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
|**200** | 대량 생성 처리 결과 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiAdminSwapFeeCalculatePost**
> apiAdminSwapFeeCalculatePost(apiAdminSwapFeeCalculatePostRequest)


### Example

```typescript
import {
    AdminSwapConfigApi,
    Configuration,
    ApiAdminSwapFeeCalculatePostRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminSwapConfigApi(configuration);

let apiAdminSwapFeeCalculatePostRequest: ApiAdminSwapFeeCalculatePostRequest; //

const { status, data } = await apiInstance.apiAdminSwapFeeCalculatePost(
    apiAdminSwapFeeCalculatePostRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **apiAdminSwapFeeCalculatePostRequest** | **ApiAdminSwapFeeCalculatePostRequest**|  | |


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
|**200** | 계산 성공 |  -  |
|**404** | 설정을 찾을 수 없음 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiAdminSwapFeeConfigsGet**
> apiAdminSwapFeeConfigsGet()


### Example

```typescript
import {
    AdminSwapConfigApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminSwapConfigApi(configuration);

let page: number; // (optional) (default to 1)
let limit: number; // (optional) (default to 20)
let swapType: 'XRP_TO_KRW' | 'KRW_TO_XRP' | 'IOU_TRANSFER'; // (optional) (default to undefined)
let isActive: boolean; // (optional) (default to undefined)

const { status, data } = await apiInstance.apiAdminSwapFeeConfigsGet(
    page,
    limit,
    swapType,
    isActive
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] |  | (optional) defaults to 1|
| **limit** | [**number**] |  | (optional) defaults to 20|
| **swapType** | [**&#39;XRP_TO_KRW&#39; | &#39;KRW_TO_XRP&#39; | &#39;IOU_TRANSFER&#39;**]**Array<&#39;XRP_TO_KRW&#39; &#124; &#39;KRW_TO_XRP&#39; &#124; &#39;IOU_TRANSFER&#39;>** |  | (optional) defaults to undefined|
| **isActive** | [**boolean**] |  | (optional) defaults to undefined|


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
|**200** | 수수료 설정 목록 조회 성공 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiAdminSwapFeeConfigsIdDeactivatePost**
> apiAdminSwapFeeConfigsIdDeactivatePost()


### Example

```typescript
import {
    AdminSwapConfigApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminSwapConfigApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.apiAdminSwapFeeConfigsIdDeactivatePost(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


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
|**200** | 설정 비활성화 성공 |  -  |
|**404** | 설정을 찾을 수 없음 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiAdminSwapFeeConfigsIdGet**
> apiAdminSwapFeeConfigsIdGet()


### Example

```typescript
import {
    AdminSwapConfigApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminSwapConfigApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.apiAdminSwapFeeConfigsIdGet(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


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
|**200** | 수수료 설정 조회 성공 |  -  |
|**404** | 설정을 찾을 수 없음 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiAdminSwapFeeConfigsIdPut**
> apiAdminSwapFeeConfigsIdPut(swapFeeConfig)


### Example

```typescript
import {
    AdminSwapConfigApi,
    Configuration,
    SwapFeeConfig
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminSwapConfigApi(configuration);

let id: string; // (default to undefined)
let swapFeeConfig: SwapFeeConfig; //

const { status, data } = await apiInstance.apiAdminSwapFeeConfigsIdPut(
    id,
    swapFeeConfig
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **swapFeeConfig** | **SwapFeeConfig**|  | |
| **id** | [**string**] |  | defaults to undefined|


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
|**200** | 설정 업데이트 성공 |  -  |
|**404** | 설정을 찾을 수 없음 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiAdminSwapFeeConfigsPost**
> apiAdminSwapFeeConfigsPost(swapFeeConfig)


### Example

```typescript
import {
    AdminSwapConfigApi,
    Configuration,
    SwapFeeConfig
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminSwapConfigApi(configuration);

let swapFeeConfig: SwapFeeConfig; //

const { status, data } = await apiInstance.apiAdminSwapFeeConfigsPost(
    swapFeeConfig
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **swapFeeConfig** | **SwapFeeConfig**|  | |


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
|**200** | 설정 생성 성공 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiAdminSwapFeeCurrentSwapTypeGet**
> apiAdminSwapFeeCurrentSwapTypeGet()


### Example

```typescript
import {
    AdminSwapConfigApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminSwapConfigApi(configuration);

let swapType: 'XRP_TO_KRW' | 'KRW_TO_XRP' | 'IOU_TRANSFER'; // (default to undefined)

const { status, data } = await apiInstance.apiAdminSwapFeeCurrentSwapTypeGet(
    swapType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **swapType** | [**&#39;XRP_TO_KRW&#39; | &#39;KRW_TO_XRP&#39; | &#39;IOU_TRANSFER&#39;**]**Array<&#39;XRP_TO_KRW&#39; &#124; &#39;KRW_TO_XRP&#39; &#124; &#39;IOU_TRANSFER&#39;>** |  | defaults to undefined|


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
|**200** | 현재 활성 설정 조회 성공 |  -  |
|**404** | 활성 설정을 찾을 수 없음 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiAdminSwapFeeStatsGet**
> apiAdminSwapFeeStatsGet()


### Example

```typescript
import {
    AdminSwapConfigApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminSwapConfigApi(configuration);

const { status, data } = await apiInstance.apiAdminSwapFeeStatsGet();
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

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

