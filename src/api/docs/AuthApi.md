# AuthApi

All URIs are relative to *http://localhost:3000*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiAuthLoginPost**](#apiauthloginpost) | **POST** /api/auth/login | 사용자 로그인|
|[**apiAuthRegisterPost**](#apiauthregisterpost) | **POST** /api/auth/register | 신규 사용자 등록 및 XRP 지갑 생성|

# **apiAuthLoginPost**
> ApiAuthRegisterPost201Response apiAuthLoginPost(apiAuthLoginPostRequest)


### Example

```typescript
import {
    AuthApi,
    Configuration,
    ApiAuthLoginPostRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

let apiAuthLoginPostRequest: ApiAuthLoginPostRequest; //

const { status, data } = await apiInstance.apiAuthLoginPost(
    apiAuthLoginPostRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **apiAuthLoginPostRequest** | **ApiAuthLoginPostRequest**|  | |


### Return type

**ApiAuthRegisterPost201Response**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 로그인 성공, JWT 토큰 반환 |  -  |
|**400** | 잘못된 요청 (이메일 또는 비밀번호 누락) |  -  |
|**401** | 인증 실패 (잘못된 자격 증명) |  -  |
|**500** | 서버 내부 오류 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiAuthRegisterPost**
> ApiAuthRegisterPost201Response apiAuthRegisterPost(apiAuthRegisterPostRequest)


### Example

```typescript
import {
    AuthApi,
    Configuration,
    ApiAuthRegisterPostRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

let apiAuthRegisterPostRequest: ApiAuthRegisterPostRequest; //

const { status, data } = await apiInstance.apiAuthRegisterPost(
    apiAuthRegisterPostRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **apiAuthRegisterPostRequest** | **ApiAuthRegisterPostRequest**|  | |


### Return type

**ApiAuthRegisterPost201Response**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | 사용자 등록 성공 |  -  |
|**400** | 잘못된 요청 (이메일, 비밀번호 누락 또는 형식 오류) |  -  |
|**409** | 이미 존재하는 사용자 |  -  |
|**500** | 서버 내부 오류 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

