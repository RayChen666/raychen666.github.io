import {
    Column,
    Flex,
    Heading,
    SmartLink,
    Text,
    Row,
    Media,
  } from "@once-ui-system/core";



interface KeywordsProps {
    keywords: string;
  }
  
  export function Keywords({ keywords }: KeywordsProps) {
    return (
      <Text variant="body-default-s" onBackground="neutral-weak">
        {keywords.split('|').map((k, i, arr) => (
          <span key={i}>
            {k.trim()}
            {i < arr.length - 1 && <span style={{ margin: '0 12px', opacity: 0.4 }}>|</span>}
          </span>
        ))}
      </Text>
    );
  }