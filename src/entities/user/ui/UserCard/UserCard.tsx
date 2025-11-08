import type { ReactNode } from 'react';
import type { User } from '@/entities/user/model/types';
import { TEXTS } from '@/shared/config';
import { StyledCard, StyledName, StyledInfo, StyledMeta } from './UserCard.styles';

interface UserCardProps {
  user: User;
  children?: ReactNode;
}

export function UserCard({ user, children }: UserCardProps) {
  const { id, name, email, username, phone, website } = user;

  return (
    <StyledCard data-fsd-path="entities/user/UserCard">
      <StyledName>{name}</StyledName>
      <StyledInfo>
        {TEXTS.labels.emailWithColon} {email}
      </StyledInfo>
      <StyledInfo>
        {TEXTS.labels.usernameWithColon} {username}
      </StyledInfo>
      {phone && (
        <StyledInfo>
          {TEXTS.labels.phoneWithColon} {phone}
        </StyledInfo>
      )}
      {website && (
        <StyledInfo>
          {TEXTS.labels.websiteWithColon} {website}
        </StyledInfo>
      )}
      <StyledMeta>
        <span>
          {TEXTS.labels.idWithColon} {id}
        </span>
        {children}
      </StyledMeta>
    </StyledCard>
  );
}
