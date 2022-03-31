import {
  Button as ChakraButton,
  LightMode,
  type ButtonProps,
} from '@chakra-ui/react';
import { transparentize } from '@chakra-ui/theme-tools';
import { generateKeyPair } from 'crypto';

const Button = ({ colorScheme, variant, ...props }: ButtonProps) => {
  const isBrand = colorScheme === 'brand';

  let btn;
  let config: ButtonProps = {};

  if (isBrand) {
    // add more variants when needed
    // https://github.com/chakra-ui/chakra-ui/blob/724d3e15100324be88d74ecf664356ed9f8205c6/packages/theme/src/components/button.ts
    switch (variant) {
      case undefined:
      case 'solid':
        config = {
          bg: 'brand.300',
          color: 'gray.800',
          _hover: {
            bg: 'brand.400',
            _disabled: {
              bg: 'brand.300',
            },
          },
          _active: {
            bg: 'brand.500',
          },
        };
        break;
      case 'ghost': 
        config = {
          bg: 'transparent',
          color: 'brand.300',
          _hover: {
            bg: transparentize('brand.300', 0.12),
          },
          _active: {
            bg: transparentize('brand.300', 0.24)
          }
        }
        break;
      default:
        throw new Error('Button variant does not exist');
    }
  }

  return (
    <ChakraButton
      {...props}
      {...config}
      variant={variant}
      colorScheme={!isBrand ? colorScheme : undefined}
    >
      {props.children}
    </ChakraButton>
  );
};

export default Button;
