# ApiAdminExchangeRateConvertPostRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**amount** | **number** |  | [optional] [default to undefined]
**fromCurrency** | **string** |  | [optional] [default to undefined]
**toCurrency** | **string** |  | [optional] [default to undefined]
**rateId** | **string** | (선택) 특정 환율 ID로 계산, 없으면 현재 활성 환율 사용 | [optional] [default to undefined]

## Example

```typescript
import { ApiAdminExchangeRateConvertPostRequest } from './api';

const instance: ApiAdminExchangeRateConvertPostRequest = {
    amount,
    fromCurrency,
    toCurrency,
    rateId,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
