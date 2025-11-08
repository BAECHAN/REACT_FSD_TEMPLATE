import { Button } from '@/shared/ui/Button';
import { useCounter } from '@/features/counter-example/model/useCounter';
import { TEXTS } from '@/shared/config';
import { StyledCounterContainer, StyledCounterValue, StyledCounterActions } from './Counter.styles';
export function Counter() {
  const { count, increment, decrement, reset } = useCounter();

  return (
    <StyledCounterContainer data-fsd-path="features/counter-example/Counter">
      <StyledCounterValue>{count}</StyledCounterValue>
      <StyledCounterActions>
        <Button onClick={decrement} variant="secondary">
          -1
        </Button>
        <Button onClick={reset} variant="ghost">
          {TEXTS.buttons.reset}
        </Button>
        <Button onClick={increment}>+1</Button>
      </StyledCounterActions>
    </StyledCounterContainer>
  );
}
