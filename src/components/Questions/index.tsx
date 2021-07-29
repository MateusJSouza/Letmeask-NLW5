// ReactNode -> qualquer conteúdo JSX
import { ReactNode } from 'react';
import './styles.scss';

type QuestionProps = {
  content: string;
  author: {
    name: string;
    avatar: string;
  },
  children?: ReactNode;
}

export function Question({
  // Desestruturação, pegando somente o author e o content
  // sem precisar usar somente o (props: QuestionProps)
  content,
  author,
  children
}: QuestionProps) {
  return (
    <div className="question">
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