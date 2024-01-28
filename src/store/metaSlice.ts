import { createSlice } from '@reduxjs/toolkit'
import { bitable } from "@lark-base-open/js-sdk";

export const metaSlice = createSlice({
    name: 'meta',
    initialState: {
        fields: []
    }, 
    reducers: {
        setFields(state, action) {
            state.fields = action.payload;
        }
    },
})

export const { setFields } = metaSlice.actions;

export const fetchAllFields = () => async dispatch => {
    const table = await bitable.base.getActiveTable();
    const fields = await table.getFieldMetaList();
    dispatch(setFields(fields));
}

export default metaSlice.reducer;