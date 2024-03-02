"use client"
import { Container, Group, Loader, RangeSlider, RangeSliderProps, Text } from "@mantine/core";
import classes from "./SummaryInput.module.css"
import { DateTimePicker, DateValue } from "@mantine/dates"
import { useEffect, useState } from "react";
import { Log } from "@/entities/Log";

interface SummaryInputProps{
    onChange: (params: SummaryInputParams) => void;
    log: Log
}

interface SummaryInputParams{
    timeFrom: number;
    timeTo: number;
    lineFrom: number;
    lineTo: number;
}

export type { SummaryInputParams }

export default function SummaryInput({onChange, log} : SummaryInputProps) {

    if(!log){
        return (
        <Group justify="center">
            <Loader/>
        </Group>);
        
        
    }

    const max = log.lines;
    const minDate = new Date(log.firstLogTime);
    const maxDate = new Date(log.lastLogTime);

    const [range, setRange] = useState<RangeSliderProps>([0, max] as RangeSliderProps);
    const [startDate, setStartDate] = useState<DateValue>(minDate)
    const [endDate, setEndDate] = useState<DateValue>(maxDate)

    const [firstValue, secondValue] = range as [number, number];

    const params = {
        timeFrom: startDate?.getTime(),
        timeTo: endDate?.getTime(),
        lineFrom: firstValue,
        lineTo: secondValue
    } as SummaryInputParams;

    const handleInputChange = () => {
        onChange(params);
    }

    

    return (
        <div className={classes.summaryInput}>
            <div>
                <Text mb={12}>Log-Range</Text>
                <RangeSlider 
                    labelAlwaysOn 
                    max={max} 
                    min={0} 
                    step={ Math.round( max / 200 )} 
                    classNames={classes} 
                    className={classes.slider} 
                    ml={16}
                    mr={16}
                    onChange={(value) => {
                        setRange(value as RangeSliderProps);
                    }}
                    onMouseUp={handleInputChange}/>
            </div>
            <Text mt={24} mb={6}>Time-Range</Text>
            <div className={classes.timeWapper}>
                <DateTimePicker typeof="range"  withSeconds placeholder="Pick start-date" className={classes.input} 
                    onChange={(value) => {
                        setStartDate(value);
                        handleInputChange();
                    }} 
                    minDate={minDate} 
                    maxDate={maxDate} 
                    value={minDate}
                    radius="md"/>
                <DateTimePicker typeof="range"  withSeconds placeholder="Pick end-date" className={classes.input} 
                    onChange={(value) => {
                        setEndDate(value);
                        handleInputChange();
                    }} 
                    minDate={minDate} 
                    maxDate={maxDate} 
                    value={maxDate}
                    radius="md"
                    mb={6}/>
            </div>
        </div>
    );
}