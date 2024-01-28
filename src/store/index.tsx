import { configureStore } from '@reduxjs/toolkit'
import metaReducer from './metaSlice'
import descriptiveSlice from './descriptiveSlice'

export default configureStore({
  reducer: {
    meta: metaReducer,
    descriptive: descriptiveSlice,
  },
})

export enum StatFieldType {
  Categorical,
  Numerical
}