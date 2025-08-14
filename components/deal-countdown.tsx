'use client';

import { Link } from 'lucide-react';
import { Button } from './ui/button';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const TARGET_DATE = new Date('2025-12-31T23:59:59');

const calculateTimeRemaining = (targetDate: Date) => {
  const currentTime = new Date();
  const timeDifference = Math.max(Number(targetDate) - Number(currentTime), 0);
  return {
    days: Math.floor(timeDifference / (1000 * 60 * 60 * 24)),
    hours: Math.floor(timeDifference / (1000 * 60 * 60)) % 24,
    minutes: Math.floor(timeDifference / (1000 * 60)) % 60,
    seconds: Math.floor(timeDifference / 1000) % 60,
  };
};

const DealCountdown = () => {
  const [time, setTime] = useState<ReturnType<typeof calculateTimeRemaining>>(
    calculateTimeRemaining(TARGET_DATE)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(calculateTimeRemaining(TARGET_DATE));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!time) {
    return (
      <section className="grid grid-cols-1 md:grid-cols-2 my-20">
        <div className="flex flex-col gap-2 justify-center">
          <h3 className="text-3xl font-bold">Loading CountDown</h3>
        </div>
      </section>
    );
  }

  if (time.days === 0 && time.hours === 0 && time.minutes === 0 && time.seconds === 0) {
    return (
      <section className="grid grid-cols-1 md:grid-cols-2 my-20">
        <div className="flex flex-col gap-2 justify-center">
          <h3 className="text-3xl font-bold">Deal Expired</h3>
          <p>This deal is no longer available. Check out our other deals!</p>
        </div>
      </section>
    );
  }

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 my-20">
      <div className="flex flex-col gap-2 justify-center">
        <h3 className="text-3xl font-bold">Deal Of The Month</h3>
        <p>
          Get ready for a shopping experience like never before with out Deals of the Moth! Every
          purchase comes with exclusive perks and offers, making this month a celebration of savvy
          choices and amazing deals. Don&apos;t miss out!
        </p>
        <ul className="grid grid-cols-4">
          <StatBox label="Days" value={time.days} />
          <StatBox label="Hours" value={time.hours} />
          <StatBox label="Minutes" value={time.minutes} />
          <StatBox label="Seconds" value={time.seconds} />
        </ul>
        <div className="text-center">
          <Button asChild>
            <Link href="/search">View Products</Link>
          </Button>
        </div>
      </div>
      <div className="flex justify-center">
        <Image src="/images/promo.jpg" alt="Deal of the Month" width={300} height={300} />
      </div>
    </section>
  );
};

const StatBox = ({ label, value }: { label: string; value: number }) => {
  return (
    <li className="p-4 w-full text-center">
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </li>
  );
};

export default DealCountdown;
