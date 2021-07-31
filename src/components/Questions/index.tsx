// ReactNode -> qualquer conteúdo JSX
import { ReactNode } from 'react';
import cx from 'classnames';

import './styles.scss';

type QuestionProps = {
  content: string;
  author: {
    name: string;
    avatar: string;
  },
  children?: ReactNode;
  isAnswered?: boolean;
  isHighLighted?: boolean;
}

export function Question({
  // Desestruturação, pegando somente o author e o content
  // sem precisar usar somente o (props: QuestionProps)
  // por padrão, o valor iniciará como false em isAnswered e isHighlight
  content,
  author,
  isAnswered = false,
  isHighLighted = false,
  children
}: QuestionProps) {
  return (
    // {nomeDaClasse: caso o bool for true = isAnswered}
    <div
    className={cx(
      'question',
      {answered: isAnswered},
      {highlighted: isHighLighted && !isAnswered}
    )}
    >
      <p>{content}</p>
      <footer>
        <div className="user-info">
          <img src={author.avatar} alt={author.name} />
          <span>{author.name}</span>
        </div>
        <div>{children}</div>
      </footer>
    </div>
  );
}