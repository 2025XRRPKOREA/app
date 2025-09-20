# SwapApi

All URIs are relative to *http://localhost:3000*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiTransactionSwapCalculateFeePost**](#apitransactionswapcalculatefeepost) | **POST** /api/transaction/swap/calculate-fee | 스왑 수수료 미리보기 계산|
|[**apiTransactionSwapKrwToXrpPost**](#apitransactionswapkrwtoxrppost) | **POST** /api/transaction/swap/krw-to-xrp | KRW IOU를 XRP로 스왑|
|[**apiTransactionSwapXrpToKrwPost**](#apitransactionswapxrptokrwpost) | **POST** /api/transaction/swap/xrp-to-krw | XRP를 KRW IOU로 스왑|

# **apiTransactionSwapCalculateFeePost**
> apiTransactionSwapCalculateFeePost(apiTransactionSwapCalculateFeePostRequest)


### Example

```typescript
import {
    SwapApi,
    Configuration,
    ApiTransactionSwapCalculateFeePostRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new SwapApi(configuration);

let apiTransactionSwapCalculateFeePostRequest: ApiTransactionSwapCalculateFeePostRequest; //

const { status, data } = await apiInstance.apiTransactionSwapCalculateFeePost(
    apiTransactionSwapCalculateFeePostRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **apiTransactionSwapCalculateFeePostRequest** | **ApiTransactionSwapCalculateFeePostRequest**|  | |


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
|**200** | 수수료 계산 결과 |  -  |
|**400** | 잘못된 요청 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiTransactionSwapKrwToXrpPost**
> apiTransactionSwapKrwToXrpPost(apiTransactionSwapKrwToXrpPostRequest)


### Example

```typescript
import {
    SwapApi,
    Configuration,
    ApiTransactionSwapKrwToXrpPostRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new SwapApi(configuration);

let apiTransactionSwapKrwToXrpPostRequest: ApiTransactionSwapKrwToXrpPostRequest; //

const { status, data } = await apiInstance.apiTransactionSwapKrwToXrpPost(
    apiTransactionSwapKrwToXrpPostRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **apiTransactionSwapKrwToXrpPostRequest** | **ApiTransactionSwapKrwToXrpPostRequest**|  | |


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
|**200** | 스왑 요청 성공 |  -  |
|**400** | 잘못된 요청 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiTransactionSwapXrpToKrwPost**
> apiTransactionSwapXrpToKrwPost(apiTransactionSwapXrpToKrwPostRequest)


### Example

```typescript
import {
    SwapApi,
    Configuration,
    ApiTransactionSwapXrpToKrwPostRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new SwapApi(configuration);

let apiTransactionSwapXrpToKrwPostRequest: ApiTransactionSwapXrpToKrwPostRequest; //

const { status, data } = await apiInstance.apiTransactionSwapXrpToKrwPost(
    apiTransactionSwapXrpToKrwPostRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **apiTransactionSwapXrpToKrwPostRequest** | **ApiTransactionSwapXrpToKrwPostRequest**|  | |


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
|**200** | 스왑 요청 성공 |  -  |
|**400** | 잘못된 요청 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

