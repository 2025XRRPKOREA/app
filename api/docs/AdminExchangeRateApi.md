# AdminExchangeRateApi

All URIs are relative to *http://localhost:3000*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiAdminExchangeRateBatchUpdatePost**](#apiadminexchangeratebatchupdatepost) | **POST** /api/admin/exchange-rate/batch-update | 대량 환율 설정|
|[**apiAdminExchangeRateConvertPost**](#apiadminexchangerateconvertpost) | **POST** /api/admin/exchange-rate/convert | 환율 계산 시뮬레이션|
|[**apiAdminExchangeRateCurrentBaseCurrencyQuoteCurrencyGet**](#apiadminexchangeratecurrentbasecurrencyquotecurrencyget) | **GET** /api/admin/exchange-rate/current/{baseCurrency}/{quoteCurrency} | 특정 통화쌍의 현재 활성 환율 조회|
|[**apiAdminExchangeRateRatesGet**](#apiadminexchangerateratesget) | **GET** /api/admin/exchange-rate/rates | 모든 환율 설정 조회|
|[**apiAdminExchangeRateRatesIdDeactivatePost**](#apiadminexchangerateratesiddeactivatepost) | **POST** /api/admin/exchange-rate/rates/{id}/deactivate | 환율 비활성화|
|[**apiAdminExchangeRateRatesIdPut**](#apiadminexchangerateratesidput) | **PUT** /api/admin/exchange-rate/rates/{id} | 환율 정보 업데이트|
|[**apiAdminExchangeRateRatesPost**](#apiadminexchangerateratespost) | **POST** /api/admin/exchange-rate/rates | 새 환율 생성 (기존 활성 환율은 비활성화됨)|
|[**apiAdminExchangeRateStatsGet**](#apiadminexchangeratestatsget) | **GET** /api/admin/exchange-rate/stats | 환율 통계 조회|

# **apiAdminExchangeRateBatchUpdatePost**
> apiAdminExchangeRateBatchUpdatePost(apiAdminExchangeRateBatchUpdatePostRequest)


### Example

```typescript
import {
    AdminExchangeRateApi,
    Configuration,
    ApiAdminExchangeRateBatchUpdatePostRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminExchangeRateApi(configuration);

let apiAdminExchangeRateBatchUpdatePostRequest: ApiAdminExchangeRateBatchUpdatePostRequest; //

const { status, data } = await apiInstance.apiAdminExchangeRateBatchUpdatePost(
    apiAdminExchangeRateBatchUpdatePostRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **apiAdminExchangeRateBatchUpdatePostRequest** | **ApiAdminExchangeRateBatchUpdatePostRequest**|  | |


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

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiAdminExchangeRateConvertPost**
> apiAdminExchangeRateConvertPost(apiAdminExchangeRateConvertPostRequest)


### Example

```typescript
import {
    AdminExchangeRateApi,
    Configuration,
    ApiAdminExchangeRateConvertPostRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminExchangeRateApi(configuration);

let apiAdminExchangeRateConvertPostRequest: ApiAdminExchangeRateConvertPostRequest; //

const { status, data } = await apiInstance.apiAdminExchangeRateConvertPost(
    apiAdminExchangeRateConvertPostRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **apiAdminExchangeRateConvertPostRequest** | **ApiAdminExchangeRateConvertPostRequest**|  | |


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
|**404** | 환율을 찾을 수 없음 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiAdminExchangeRateCurrentBaseCurrencyQuoteCurrencyGet**
> apiAdminExchangeRateCurrentBaseCurrencyQuoteCurrencyGet()


### Example

```typescript
import {
    AdminExchangeRateApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminExchangeRateApi(configuration);

let baseCurrency: string; // (default to undefined)
let quoteCurrency: string; // (default to undefined)

const { status, data } = await apiInstance.apiAdminExchangeRateCurrentBaseCurrencyQuoteCurrencyGet(
    baseCurrency,
    quoteCurrency
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **baseCurrency** | [**string**] |  | defaults to undefined|
| **quoteCurrency** | [**string**] |  | defaults to undefined|


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
|**200** | 현재 환율 조회 성공 |  -  |
|**404** | 활성 환율을 찾을 수 없음 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiAdminExchangeRateRatesGet**
> apiAdminExchangeRateRatesGet()


### Example

```typescript
import {
    AdminExchangeRateApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminExchangeRateApi(configuration);

let page: number; // (optional) (default to 1)
let limit: number; // (optional) (default to 20)
let baseCurrency: string; // (optional) (default to undefined)
let quoteCurrency: string; // (optional) (default to undefined)
let isActive: boolean; // (optional) (default to undefined)

const { status, data } = await apiInstance.apiAdminExchangeRateRatesGet(
    page,
    limit,
    baseCurrency,
    quoteCurrency,
    isActive
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] |  | (optional) defaults to 1|
| **limit** | [**number**] |  | (optional) defaults to 20|
| **baseCurrency** | [**string**] |  | (optional) defaults to undefined|
| **quoteCurrency** | [**string**] |  | (optional) defaults to undefined|
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
|**200** | 환율 설정 목록 조회 성공 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiAdminExchangeRateRatesIdDeactivatePost**
> apiAdminExchangeRateRatesIdDeactivatePost()


### Example

```typescript
import {
    AdminExchangeRateApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminExchangeRateApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.apiAdminExchangeRateRatesIdDeactivatePost(
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
|**200** | 환율 비활성화 성공 |  -  |
|**404** | 환율을 찾을 수 없음 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiAdminExchangeRateRatesIdPut**
> apiAdminExchangeRateRatesIdPut(exchangeRate)


### Example

```typescript
import {
    AdminExchangeRateApi,
    Configuration,
    ExchangeRate
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminExchangeRateApi(configuration);

let id: string; // (default to undefined)
let exchangeRate: ExchangeRate; //

const { status, data } = await apiInstance.apiAdminExchangeRateRatesIdPut(
    id,
    exchangeRate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **exchangeRate** | **ExchangeRate**|  | |
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
|**200** | 환율 업데이트 성공 |  -  |
|**404** | 환율을 찾을 수 없음 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiAdminExchangeRateRatesPost**
> apiAdminExchangeRateRatesPost(exchangeRate)


### Example

```typescript
import {
    AdminExchangeRateApi,
    Configuration,
    ExchangeRate
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminExchangeRateApi(configuration);

let exchangeRate: ExchangeRate; //

const { status, data } = await apiInstance.apiAdminExchangeRateRatesPost(
    exchangeRate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **exchangeRate** | **ExchangeRate**|  | |


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
|**200** | 환율 생성 성공 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiAdminExchangeRateStatsGet**
> apiAdminExchangeRateStatsGet()


### Example

```typescript
import {
    AdminExchangeRateApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminExchangeRateApi(configuration);

const { status, data } = await apiInstance.apiAdminExchangeRateStatsGet();
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

