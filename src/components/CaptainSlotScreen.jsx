import { useEffect, useState } from 'react';
import Avatar from './Avatar';

export default function CaptainSlotScreen({
  members,
  finalCaptain,
  label,
  color
}) {
  const [current, setCurrent] = useState(members[0]);

  useEffect(() => {
    let index = 0;

    const interval = setInterval(() => {
      setCurrent(members[index % members.length]);
      index++;
    }, 100);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      setCurrent(finalCaptain);
    }, 2500);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="h-[70vh] flex flex-col items-center justify-center">
      <div className={`text-3xl mb-10 font-black ${color}`}>
        {label}
      </div>

      <div className="animate-pulse">
        <Avatar src={current.avatar} size={240} />
      </div>

      <div className="mt-8 text-6xl font-black tracking-wide">
        {current.baseName}
      </div>
    </div>
  );
}
