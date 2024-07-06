import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    comments: [],
};

export const commentSlice = createSlice({
    name: "comment",
    initialState,
    reducers: {
        fetchCommentsSuccess: (state, action) => {
            state.comments = action.payload;
        },
        addCommentSuccess: (state, action) => {
            state.comments.push(action.payload)
        }
    }
});

export const { fetchCommentsSuccess, addCommentSuccess } = commentSlice.actions;
export default commentSlice.reducer;