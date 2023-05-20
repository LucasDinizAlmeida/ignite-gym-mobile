import { Image, IImageProps } from "native-base";

interface Props extends IImageProps {
  size: number
}

export function UserPhoto({ size, ...rest }: Props) {

  return (
    <Image
      w={size}
      h={size}
      rounded='full'
      {...rest}
    />
  )
}