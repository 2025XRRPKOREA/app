# WalletApi

All URIs are relative to *http://localhost:3000*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiWalletAccountGet**](#apiwalletaccountget) | **GET** /api/wallet/account | XRP 계정 정보 조회|
|[**apiWalletBalanceGet**](#apiwalletbalanceget) | **GET** /api/wallet/balance | XRP 잔액 조회|
|[**apiWalletKrwBalanceGet**](#apiwalletkrwbalanceget) | **GET** /api/wallet/krw/balance | KRW IOU 잔액 조회|
|[**apiWalletKrwCanTradeGet**](#apiwalletkrwcantradeget) | **GET** /api/wallet/krw/can-trade | KRW IOU 거래 가능 여부 확인|
|[**apiWalletKrwCheckPermissionGet**](#apiwalletkrwcheckpermissionget) | **GET** /api/wallet/krw/check-permission | KRW IOU Trust Line 권한 확인|
|[**apiWalletKrwCreateTrustlinePost**](#apiwalletkrwcreatetrustlinepost) | **POST** /api/wallet/krw/create-trustline | KRW IOU Trust Line 생성|
|[**apiWalletSummaryGet**](#apiwalletsummaryget) | **GET** /api/wallet/summary | 지갑 요약 정보 조회 (XRP 및 IOU 잔액 포함)|
|[**apiWalletTrustlinesGet**](#apiwallettrustlinesget) | **GET** /api/wallet/trustlines | 모든 Trust Line 조회|
|[**apiWalletValidateAddressPost**](#apiwalletvalidateaddresspost) | **POST** /api/wallet/validate-address | XRP 주소 유효성 검증|

# **apiWalletAccountGet**
> apiWalletAccountGet()


### Example

```typescript
import {
    WalletApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new WalletApi(configuration);

const { status, data } = await apiInstance.apiWalletAccountGet();
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
|**200** | 성공적으로 계정 정보를 조회함 |  -  |
|**404** | 사용자를 찾을 수 없음 |  -  |
|**500** | 서버 오류 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiWalletBalanceGet**
> ApiWalletBalanceGet200Response apiWalletBalanceGet()


### Example

```typescript
import {
    WalletApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new WalletApi(configuration);

const { status, data } = await apiInstance.apiWalletBalanceGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**ApiWalletBalanceGet200Response**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 성공적으로 XRP 잔액을 조회함 |  -  |
|**404** | 사용자를 찾을 수 없음 |  -  |
|**500** | 서버 오류 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiWalletKrwBalanceGet**
> apiWalletKrwBalanceGet()


### Example

```typescript
import {
    WalletApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new WalletApi(configuration);

const { status, data } = await apiInstance.apiWalletKrwBalanceGet();
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
|**200** | 성공적으로 KRW IOU 잔액을 조회함 |  -  |
|**404** | 사용자를 찾을 수 없음 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiWalletKrwCanTradeGet**
> apiWalletKrwCanTradeGet()


### Example

```typescript
import {
    WalletApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new WalletApi(configuration);

const { status, data } = await apiInstance.apiWalletKrwCanTradeGet();
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
|**200** | 성공적으로 거래 가능 여부를 조회함 |  -  |
|**404** | 사용자를 찾을 수 없음 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiWalletKrwCheckPermissionGet**
> apiWalletKrwCheckPermissionGet()


### Example

```typescript
import {
    WalletApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new WalletApi(configuration);

const { status, data } = await apiInstance.apiWalletKrwCheckPermissionGet();
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
|**200** | 성공적으로 권한 상태를 조회함 |  -  |
|**404** | 사용자를 찾을 수 없음 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiWalletKrwCreateTrustlinePost**
> apiWalletKrwCreateTrustlinePost()


### Example

```typescript
import {
    WalletApi,
    Configuration,
    ApiWalletKrwCreateTrustlinePostRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new WalletApi(configuration);

let apiWalletKrwCreateTrustlinePostRequest: ApiWalletKrwCreateTrustlinePostRequest; // (optional)

const { status, data } = await apiInstance.apiWalletKrwCreateTrustlinePost(
    apiWalletKrwCreateTrustlinePostRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **apiWalletKrwCreateTrustlinePostRequest** | **ApiWalletKrwCreateTrustlinePostRequest**|  | |


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
|**200** | Trust Line 생성 성공 또는 이미 존재함 |  -  |
|**400** | 지갑 시드 없음 |  -  |
|**404** | 사용자를 찾을 수 없음 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiWalletSummaryGet**
> apiWalletSummaryGet()


### Example

```typescript
import {
    WalletApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new WalletApi(configuration);

const { status, data } = await apiInstance.apiWalletSummaryGet();
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
|**200** | 성공적으로 지갑 요약 정보를 조회함 |  -  |
|**404** | 사용자를 찾을 수 없음 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiWalletTrustlinesGet**
> apiWalletTrustlinesGet()


### Example

```typescript
import {
    WalletApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new WalletApi(configuration);

const { status, data } = await apiInstance.apiWalletTrustlinesGet();
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
|**200** | 성공적으로 모든 Trust Line을 조회함 |  -  |
|**404** | 사용자를 찾을 수 없음 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiWalletValidateAddressPost**
> apiWalletValidateAddressPost(apiWalletValidateAddressPostRequest)


### Example

```typescript
import {
    WalletApi,
    Configuration,
    ApiWalletValidateAddressPostRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new WalletApi(configuration);

let apiWalletValidateAddressPostRequest: ApiWalletValidateAddressPostRequest; //

const { status, data } = await apiInstance.apiWalletValidateAddressPost(
    apiWalletValidateAddressPostRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **apiWalletValidateAddressPostRequest** | **ApiWalletValidateAddressPostRequest**|  | |


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
|**200** | 유효성 검증 결과 |  -  |
|**400** | 주소 누락 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

