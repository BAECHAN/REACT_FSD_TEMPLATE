import { Link } from 'react-router-dom';
import { Header } from '@/widgets/header';
import { PageLayout } from '@/widgets/page-layout';
import { Button } from '@/shared/ui/Button';
import { ROUTES_PATHS, TEXTS } from '@/shared/config';
import { DateFormatDemo } from '@/widgets/date-format-demo';
import { AssetsDemo } from '@/widgets/assets-demo';
import { UIComponentsDemo } from '@/widgets/ui-components-demo';
import { CounterDemo } from '@/widgets/counter-demo';
import {
  StyledContainer,
  StyledSection,
  StyledSectionTitle,
  StyledSectionDescription,
} from './HomePage.styles';

export function HomePage() {
  return (
    <>
      <Header />
      <PageLayout title="JSONPlaceholder API 예제" description="게시글과 사용자 관리 예제">
        <StyledContainer>
          <StyledSection>
            <StyledSectionTitle>{TEXTS.ui.postManagement}</StyledSectionTitle>
            <StyledSectionDescription>
              {TEXTS.ui.postManagementDescription}
            </StyledSectionDescription>
            <Button as={Link} to={ROUTES_PATHS.POSTS.LIST}>
              {TEXTS.buttons.postList}
            </Button>
          </StyledSection>

          <StyledSection>
            <StyledSectionTitle>{TEXTS.ui.userManagement}</StyledSectionTitle>
            <StyledSectionDescription>
              {TEXTS.ui.userManagementDescription}
            </StyledSectionDescription>
            <Button as={Link} to={ROUTES_PATHS.USERS.LIST}>
              {TEXTS.buttons.userList}
            </Button>
          </StyledSection>

          <div style={{ gridColumn: '1 / -1' }}>
            <UIComponentsDemo />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <CounterDemo />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <DateFormatDemo />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <AssetsDemo />
          </div>
        </StyledContainer>
      </PageLayout>
    </>
  );
}
