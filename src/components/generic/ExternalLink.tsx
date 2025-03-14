import { navigateUrl } from '../../lib/utils';
import { AnchorHTMLAttributes, FC } from 'react';

const ExternalLink: FC<AnchorHTMLAttributes<HTMLAnchorElement>> = (props) => {
  return (
    <a
      {...props}
      children={props.children ?? props.href}
      target='_blank'
      onClick={(e) => {
        e.preventDefault();
        props.onClick ? props.onClick(e) : props.href && navigateUrl(props.href);
      }}
    />
  );
};

export default ExternalLink;