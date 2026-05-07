import { TbWorldShare } from "react-icons/tb";

export const DocsLink = ({
  title,
  href,
  docsTitle = "SCATTER DOCS",
}: {
  title: string;
  href: string;
  docsTitle?: string;
}) => {
  return (
    <div className="flex w-full items-center justify-between border-t">
      <div className="px-6 py-6">
        <h2 className="text-sm text-[--clr-primary-light-x]">{docsTitle}</h2>
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="text-[--clr-primary]"
        >
          {title}
        </a>
      </div>
      <a href={href} target="_blank" rel="noreferrer">
        <TbWorldShare className="mr-4 h-7 w-7 text-[--clr-primary-light-x]" />
      </a>
    </div>
  );
};

export default DocsLink;
