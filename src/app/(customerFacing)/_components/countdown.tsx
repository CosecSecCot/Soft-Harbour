"use client";
import { useState, useEffect, useCallback } from "react";

type CountdownProps = {
    targetDate: string | Date;
};

type TimeLeft = {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
};

const Countdown: React.FC<CountdownProps> = ({ targetDate }) => {
    const calculateTimeLeft = useCallback((): TimeLeft => {
        const target = new Date(targetDate);
        const difference = +target - +new Date();
        let timeLeft: TimeLeft = {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
        };

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }

        return timeLeft;
    }, [targetDate]);

    const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [calculateTimeLeft]);

    const formatTimeUnit = (value: number, unit: string): string => {
        return `${value} ${unit}${value !== 1 ? "s" : ""}`;
    };

    if (!isClient) {
        return (
            <div>
                <span>-- hours </span>
                <span>-- minutes </span>
                <span>-- seconds</span>
            </div>
        );
    }

    return (
        <div>
            <span>{formatTimeUnit(timeLeft.days, "day")} </span>
            <span>{formatTimeUnit(timeLeft.hours, "hour")} </span>
            <span>{formatTimeUnit(timeLeft.minutes, "minute")} </span>
            <span>{formatTimeUnit(timeLeft.seconds, "second")} </span>
        </div>
    );
};

export default Countdown;
