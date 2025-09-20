# TransactionApi

All URIs are relative to *http://localhost:3000*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiTransactionOfferCancelPost**](#apitransactionoffercancelpost) | **POST** /api/transaction/offer/cancel | 오퍼 취소|
|[**apiTransactionOfferCreatePost**](#apitransactionoffercreatepost) | **POST** /api/transaction/offer/create | P2P 거래 오퍼 생성|
|[**apiTransactionOffersGet**](#apitransactionoffersget) | **GET** /api/transaction/offers | 나의 활성 오퍼 목록 조회|
|[**apiTransactionOrderbookGet**](#apitransactionorderbookget) | **GET** /api/transaction/orderbook | 오더북 조회|
|[**apiTransactionTransferPost**](#apitransactiontransferpost) | **POST** /api/transaction/transfer | KRW IOU P2P 전송|

# **apiTransactionOfferCancelPost**
> apiTransactionOfferCancelPost(apiTransactionOfferCancelPostRequest)


### Example

```typescript
import {
    TransactionApi,
    Configuration,
    ApiTransactionOfferCancelPostRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new TransactionApi(configuration);

let apiTransactionOfferCancelPostRequest: ApiTransactionOfferCancelPostRequest; //

const { status, data } = await apiInstance.apiTransactionOfferCancelPost(
    apiTransactionOfferCancelPostRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **apiTransactionOfferCancelPostRequest** | **ApiTransactionOfferCancelPostRequest**|  | |


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
|**200** | 오퍼 취소 성공 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiTransactionOfferCreatePost**
> apiTransactionOfferCreatePost(apiTransactionOfferCreatePostRequest)


### Example

```typescript
import {
    TransactionApi,
    Configuration,
    ApiTransactionOfferCreatePostRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new TransactionApi(configuration);

let apiTransactionOfferCreatePostRequest: ApiTransactionOfferCreatePostRequest; //

const { status, data } = await apiInstance.apiTransactionOfferCreatePost(
    apiTransactionOfferCreatePostRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **apiTransactionOfferCreatePostRequest** | **ApiTransactionOfferCreatePostRequest**|  | |


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
|**200** | 오퍼 생성 성공 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiTransactionOffersGet**
> apiTransactionOffersGet()


### Example

```typescript
import {
    TransactionApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TransactionApi(configuration);

let limit: number; //조회할 오퍼 수 (optional) (default to 20)

const { status, data } = await apiInstance.apiTransactionOffersGet(
    limit
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **limit** | [**number**] | 조회할 오퍼 수 | (optional) defaults to 20|


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
|**200** | 오퍼 목록 조회 성공 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiTransactionOrderbookGet**
> apiTransactionOrderbookGet()


### Example

```typescript
import {
    TransactionApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TransactionApi(configuration);

let base: string; //기준 통화 (optional) (default to 'XRP')
let counter: string; //상대 통화 (optional) (default to 'KRW')
let limit: number; //조회할 오더 수 (optional) (default to 20)

const { status, data } = await apiInstance.apiTransactionOrderbookGet(
    base,
    counter,
    limit
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **base** | [**string**] | 기준 통화 | (optional) defaults to 'XRP'|
| **counter** | [**string**] | 상대 통화 | (optional) defaults to 'KRW'|
| **limit** | [**number**] | 조회할 오더 수 | (optional) defaults to 20|


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
|**200** | 오더북 조회 성공 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiTransactionTransferPost**
> apiTransactionTransferPost(apiTransactionTransferPostRequest)


### Example

```typescript
import {
    TransactionApi,
    Configuration,
    ApiTransactionTransferPostRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new TransactionApi(configuration);

let apiTransactionTransferPostRequest: ApiTransactionTransferPostRequest; //

const { status, data } = await apiInstance.apiTransactionTransferPost(
    apiTransactionTransferPostRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **apiTransactionTransferPostRequest** | **ApiTransactionTransferPostRequest**|  | |


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
|**200** | 전송 성공 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

