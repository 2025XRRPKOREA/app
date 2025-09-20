# ApiTransactionOfferCreatePostRequest

TakerGets와 TakerPays 객체. XRP는 drops 단위(1 XRP = 1,000,000 drops)로 입력해야 합니다.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**takerGets** | **object** | 받고자 하는 자산 | [optional] [default to undefined]
**takerPays** | **object** | 지불하고자 하는 자산 | [optional] [default to undefined]
**expiration** | **number** | (선택) 오퍼 만료 시간 (Unix time) | [optional] [default to undefined]

## Example

```typescript
import { ApiTransactionOfferCreatePostRequest } from './api';

const instance: ApiTransactionOfferCreatePostRequest = {
    takerGets,
    takerPays,
    expiration,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
