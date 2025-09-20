# ApiTransactionTransferPostRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**recipientAddress** | **string** | 받는 사람 주소 | [default to undefined]
**amount** | **number** | 보낼 IOU 수량 | [default to undefined]
**memo** | **string** | (선택) 거래 메모 | [optional] [default to undefined]

## Example

```typescript
import { ApiTransactionTransferPostRequest } from './api';

const instance: ApiTransactionTransferPostRequest = {
    recipientAddress,
    amount,
    memo,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
