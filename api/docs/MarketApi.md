# MarketApi

All URIs are relative to *http://localhost:3000*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiTransactionConvertKrwToXrpPost**](#apitransactionconvertkrwtoxrppost) | **POST** /api/transaction/convert/krw-to-xrp | KRW를 XRP로 환산 (실시간 환율 기준)|
|[**apiTransactionConvertXrpToKrwPost**](#apitransactionconvertxrptokrwpost) | **POST** /api/transaction/convert/xrp-to-krw | XRP를 KRW로 환산 (실시간 환율 기준)|
|[**apiTransactionHistoryGet**](#apitransactionhistoryget) | **GET** /api/transaction/history | 나의 IOU 거래 내역 조회|
|[**apiTransactionMarketInfoGet**](#apitransactionmarketinfoget) | **GET** /api/transaction/market/info | KRW IOU 시장 정보 조회|
|[**apiTransactionMarketPairsGet**](#apitransactionmarketpairsget) | **GET** /api/transaction/market/pairs | 거래 가능한 통화쌍 목록 조회|
|[**apiTransactionMarketPriceGet**](#apitransactionmarketpriceget) | **GET** /api/transaction/market/price | 현재 시장가 조회|
|[**apiTransactionStatsGet**](#apitransactionstatsget) | **GET** /api/transaction/stats | 나의 거래 통계 조회|

# **apiTransactionConvertKrwToXrpPost**
> apiTransactionConvertKrwToXrpPost(apiTransactionConvertKrwToXrpPostRequest)


### Example

```typescript
import {
    MarketApi,
    Configuration,
    ApiTransactionConvertKrwToXrpPostRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new MarketApi(configuration);

let apiTransactionConvertKrwToXrpPostRequest: ApiTransactionConvertKrwToXrpPostRequest; //

const { status, data } = await apiInstance.apiTransactionConvertKrwToXrpPost(
    apiTransactionConvertKrwToXrpPostRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **apiTransactionConvertKrwToXrpPostRequest** | **ApiTransactionConvertKrwToXrpPostRequest**|  | |


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
|**200** | 환산 결과 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiTransactionConvertXrpToKrwPost**
> apiTransactionConvertXrpToKrwPost(apiTransactionConvertXrpToKrwPostRequest)


### Example

```typescript
import {
    MarketApi,
    Configuration,
    ApiTransactionConvertXrpToKrwPostRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new MarketApi(configuration);

let apiTransactionConvertXrpToKrwPostRequest: ApiTransactionConvertXrpToKrwPostRequest; //

const { status, data } = await apiInstance.apiTransactionConvertXrpToKrwPost(
    apiTransactionConvertXrpToKrwPostRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **apiTransactionConvertXrpToKrwPostRequest** | **ApiTransactionConvertXrpToKrwPostRequest**|  | |


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
|**200** | 환산 결과 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiTransactionHistoryGet**
> apiTransactionHistoryGet()


### Example

```typescript
import {
    MarketApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new MarketApi(configuration);

let limit: number; //조회할 거래 내역 수 (optional) (default to 10)

const { status, data } = await apiInstance.apiTransactionHistoryGet(
    limit
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **limit** | [**number**] | 조회할 거래 내역 수 | (optional) defaults to 10|


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
|**200** | 거래 내역 조회 성공 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiTransactionMarketInfoGet**
> apiTransactionMarketInfoGet()


### Example

```typescript
import {
    MarketApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new MarketApi(configuration);

const { status, data } = await apiInstance.apiTransactionMarketInfoGet();
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
|**200** | 시장 정보 조회 성공 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiTransactionMarketPairsGet**
> apiTransactionMarketPairsGet()


### Example

```typescript
import {
    MarketApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new MarketApi(configuration);

const { status, data } = await apiInstance.apiTransactionMarketPairsGet();
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
|**200** | 통화쌍 목록 조회 성공 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiTransactionMarketPriceGet**
> apiTransactionMarketPriceGet()


### Example

```typescript
import {
    MarketApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new MarketApi(configuration);

let base: string; // (optional) (default to 'XRP')
let counter: string; // (optional) (default to 'KRW')

const { status, data } = await apiInstance.apiTransactionMarketPriceGet(
    base,
    counter
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **base** | [**string**] |  | (optional) defaults to 'XRP'|
| **counter** | [**string**] |  | (optional) defaults to 'KRW'|


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
|**200** | 시장가 조회 성공 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiTransactionStatsGet**
> apiTransactionStatsGet()


### Example

```typescript
import {
    MarketApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new MarketApi(configuration);

let period: string; //조회 기간 (e.g., 24h, 7d, 30d) (optional) (default to '24h')

const { status, data } = await apiInstance.apiTransactionStatsGet(
    period
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **period** | [**string**] | 조회 기간 (e.g., 24h, 7d, 30d) | (optional) defaults to '24h'|


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
|**200** | 거래 통계 조회 성공 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

