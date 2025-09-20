# SwapFeeConfig


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**swapType** | **string** |  | [optional] [default to undefined]
**feeType** | **string** |  | [optional] [default to undefined]
**baseFee** | **number** | PERCENTAGE: 0.003 (0.3%), FIXED: 10 (10 KRW) | [optional] [default to undefined]
**minFee** | **number** |  | [optional] [default to undefined]
**maxFee** | **number** |  | [optional] [default to undefined]
**tieredRates** | [**Array&lt;SwapFeeConfigTieredRatesInner&gt;**](SwapFeeConfigTieredRatesInner.md) |  | [optional] [default to undefined]
**effectiveFrom** | **string** |  | [optional] [default to undefined]
**effectiveTo** | **string** |  | [optional] [default to undefined]
**isActive** | **boolean** |  | [optional] [default to true]
**description** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { SwapFeeConfig } from './api';

const instance: SwapFeeConfig = {
    swapType,
    feeType,
    baseFee,
    minFee,
    maxFee,
    tieredRates,
    effectiveFrom,
    effectiveTo,
    isActive,
    description,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
