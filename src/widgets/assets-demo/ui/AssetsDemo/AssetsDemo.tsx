import { HeartIcon, StarIcon, CheckIcon, UserIcon } from '@/shared/assets/icons';
import { NoImage, LogoPlaceholder } from '@/shared/assets/images';
import {
  StyledSection,
  StyledSectionTitle,
  StyledSectionDescription,
  StyledAssetsTestContainer,
  StyledIconRow,
  StyledIconItem,
  StyledIconLabel,
  StyledImageRow,
  StyledImageItem,
  StyledImageLabel,
} from './AssetsDemo.styles';

export function AssetsDemo() {
  return (
    <StyledSection data-fsd-path="widgets/assets-demo">
      <StyledSectionTitle>Assets 테스트 (아이콘 및 이미지)</StyledSectionTitle>
      <StyledSectionDescription>
        shared/assets에서 import한 아이콘과 이미지를 테스트합니다.
      </StyledSectionDescription>
      <StyledAssetsTestContainer>
        <div>
          <h3>아이콘 테스트</h3>
          <StyledIconRow>
            <StyledIconItem>
              <img src={HeartIcon} alt="Heart Icon" width="32" height="32" />
              <StyledIconLabel>HeartIcon</StyledIconLabel>
            </StyledIconItem>
            <StyledIconItem>
              <img src={StarIcon} alt="Star Icon" width="32" height="32" />
              <StyledIconLabel>StarIcon</StyledIconLabel>
            </StyledIconItem>
            <StyledIconItem>
              <img src={CheckIcon} alt="Check Icon" width="32" height="32" />
              <StyledIconLabel>CheckIcon</StyledIconLabel>
            </StyledIconItem>
            <StyledIconItem>
              <img src={UserIcon} alt="User Icon" width="32" height="32" />
              <StyledIconLabel>UserIcon</StyledIconLabel>
            </StyledIconItem>
          </StyledIconRow>
        </div>

        <div>
          <h3>이미지 테스트</h3>
          <StyledImageRow>
            <StyledImageItem>
              <img
                src={NoImage}
                alt="No Image Placeholder"
                width="200"
                height="150"
                loading="lazy"
              />
              <StyledImageLabel>NoImage</StyledImageLabel>
            </StyledImageItem>
            <StyledImageItem>
              <img
                src={LogoPlaceholder}
                alt="Logo Placeholder"
                width="200"
                height="60"
                loading="lazy"
              />
              <StyledImageLabel>LogoPlaceholder</StyledImageLabel>
            </StyledImageItem>
          </StyledImageRow>
        </div>
      </StyledAssetsTestContainer>
    </StyledSection>
  );
}
