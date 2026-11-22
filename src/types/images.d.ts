// Metro đóng gói ảnh khi import (`import icon from './icon.png'`) và trả về mã tài nguyên.
declare module '*.png' {
  import type { ImageSourcePropType } from 'react-native';

  const source: ImageSourcePropType;
  export default source;
}
