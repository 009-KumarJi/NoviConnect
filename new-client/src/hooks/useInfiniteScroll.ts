import { useEffect, useState, RefObject } from 'react';

export const useInfiniteScrollTop = (
  containerRef: RefObject<HTMLElement>,
  totalPages: number,
  page: number,
  setPage: (page: number | ((prev: number) => number)) => void,
  newData?: any[]
) => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    if (newData && newData.length > 0) {
      setData((prev) => [...prev, ...newData]);
    }
  }, [newData]);

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.scrollTop === 0) {
        setPage((prev) => (prev < totalPages ? prev + 1 : prev));
      }
    };
    const div = containerRef.current;
    if (div) div.addEventListener('scroll', handleScroll);
    return () => {
      if (div) div.removeEventListener('scroll', handleScroll);
    };
  }, [containerRef, page, totalPages, setPage]);

  return { data, setData };
};
