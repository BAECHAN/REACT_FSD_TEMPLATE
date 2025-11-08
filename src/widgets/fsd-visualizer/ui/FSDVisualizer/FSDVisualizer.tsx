import { useState } from 'react';
import { getFSDStructure, type FSDItem, type FSDLayer } from '@/shared/utils';
import {
  StyledContainer,
  StyledSidebar,
  StyledSidebarHeader,
  StyledLayerButton,
  StyledMainContent,
  StyledLayerHeader,
  StyledLayerTitle,
  StyledLayerDescription,
  StyledTreeContainer,
  StyledTreeNode,
  StyledTreeNodeContent,
  StyledTreeNodeName,
  StyledTreeNodePath,
  StyledExpandButton,
  StyledBadge,
  StyledTreeChildren,
} from './FSDVisualizer.styles';

export function FSDVisualizer() {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);
  const layers: FSDLayer[] = getFSDStructure() as FSDLayer[];

  const toggleExpand = (path: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedItems(newExpanded);
  };

  const renderTreeNode = (item: FSDItem, depth = 0): React.ReactNode => {
    const isExpanded = expandedItems.has(item.path);
    const hasChildren = Boolean(item.children && item.children.length > 0);
    const indent = depth * 1.5;

    return (
      <StyledTreeNode key={item.path} $depth={depth}>
        <StyledTreeNodeContent>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              paddingLeft: `${indent}rem`,
            }}
          >
            {hasChildren ? (
              <StyledExpandButton onClick={() => toggleExpand(item.path)} type="button">
                {isExpanded ? '▼' : '▶'}
              </StyledExpandButton>
            ) : (
              <span style={{ width: '20px', display: 'inline-block' }} />
            )}
            <StyledTreeNodeName>
              {item.name}
              {item.type === 'directory' && <StyledBadge>dir</StyledBadge>}
              {item.type === 'file' && <StyledBadge $isFile>file</StyledBadge>}
            </StyledTreeNodeName>
          </div>
          <StyledTreeNodePath>{item.path}</StyledTreeNodePath>
        </StyledTreeNodeContent>
        {isExpanded && hasChildren && item.children && (
          <StyledTreeChildren>
            {item.children.map((child) => renderTreeNode(child, depth + 1))}
          </StyledTreeChildren>
        )}
      </StyledTreeNode>
    );
  };

  const currentLayer = layers.find((layer) => layer.name === selectedLayer) || layers[0];

  if (!currentLayer || layers.length === 0) {
    return null;
  }

  const firstLayer = layers[0];

  return (
    <StyledContainer>
      <StyledSidebar>
        <StyledSidebarHeader>FSD Layers</StyledSidebarHeader>
        {layers.map((layer) => (
          <StyledLayerButton
            key={layer.name}
            $isActive={selectedLayer === layer.name || (!selectedLayer && layer === firstLayer)}
            $color={layer.color}
            onClick={() => setSelectedLayer(layer.name)}
          >
            {layer.name}
          </StyledLayerButton>
        ))}
      </StyledSidebar>
      <StyledMainContent>
        <StyledLayerHeader>
          <StyledLayerTitle $color={currentLayer.color}>{currentLayer.name}</StyledLayerTitle>
          <StyledLayerDescription>{currentLayer.description}</StyledLayerDescription>
        </StyledLayerHeader>
        <StyledTreeContainer>
          {currentLayer.items.map((item) => renderTreeNode(item))}
        </StyledTreeContainer>
      </StyledMainContent>
    </StyledContainer>
  );
}
