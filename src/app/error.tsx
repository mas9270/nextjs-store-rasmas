"use client"
import { Box, Button } from '@mui/material'
import React from 'react'

export default function ErrorPage({ error, refresh }: { error: string, refresh: () => void }) {
    return (
        <Box display={"flex"} justifyContent={"center"} alignItems={"center"} flexDirection={"row"}>
            <Box p={1}>{`${error}`}</Box>
            <Button onClick={refresh} style={{ margin: "5px" }} >تلاش دوباره</Button>
        </Box>
    )
}
