import { useCallback, useMemo } from 'react';
import styled from 'styled-components';
import SliderBase, { Mark } from '@material-ui/core/Slider';

interface SliderProps {
  from: number;
  to: number;
  value: number;
  onChange: (value: number) => void;
}

const Slider = ({ from, to, value, onChange }: SliderProps) => {
  const handleChange = useCallback(
    (_event: React.ChangeEvent<{}>, value: number | number[]) =>
      onChange(value as number),
    [onChange]
  );
  const marks: Mark[] = useMemo(() => {
    return new Array(to - from + 1).fill(0).map((_, index) => ({
      value: index + from,
      label: `${index + from}`,
    }));
  }, [from, to]);
  return (
    <Container>
      <SliderBase
        value={value as number}
        onChange={handleChange}
        marks={marks}
        min={from}
        max={to}
      />
    </Container>
  );
};

const Container = styled.div`
  padding-right: 20px;
`;

export default Slider;
