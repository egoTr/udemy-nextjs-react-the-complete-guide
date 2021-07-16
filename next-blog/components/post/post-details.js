// dependences
import Head from 'next/head';
import Image from 'next/image';

// markdown
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'

// components
import IconDate from '../ui/icons/icon-date';
import IconUser from '../ui/icons/icon-user';
import Hr from '../ui/hr';

// styles
import styled from 'styled-components';
const PostDiv = styled.div`
    width: clamp(400px, 90%, 768px);
    margin: 0 auto;
    padding: 10px;

    h1 {
        margin-top: 10px;
    }

    h2 {
        margin-top: 5px;
    }

    & img {
        max-width: 100%;
    }
`;
const PostHeader = styled.div`
    margin: 0 auto 10px auto;
`;
const PostTitle = styled.p`
    color: var(--color-app-primary);
    font-size: 140%;
    font-weight: bold;
`;
const ImageDiv = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;

    & img {
        max-width: 100%;
    }
`;

export default function PostDetails(props) {
    if (!props.data)
        return <Head>
            <title>Loading...</title>
        </Head>;

    const { alias, meta, content } = props.data;
    const { title, date, image, author, excerpt } = meta;

    let dateFormatted = new Date(date);
    dateFormatted = dateFormatted.toLocaleDateString(
        'en-US',
        {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }
    )

    // Override Markdown's default rendering
    const CustomComponents = {
        /*       img(imgTag) {
                  return <Image
                      alt={imgTag.alt}
                      title={imgTag.alt}
                      src={`/images/posts/${alias}/${imgTag.src}`}
                      width={600}
                      height={337}
                  />
              }, // image  */

        p(paragraph) {
            const { node } = paragraph;

            if (node.children[0].tagName === 'img') {
                const img = node.children[0];

                return <ImageDiv>
                    <Image
                        alt={img.alt}
                        title={img.alt}
                        src={`/images/posts/${alias}/${img.properties.src}`}
                        width={600}
                        height={337}
                    />
                </ImageDiv>
            } // if

            return <p>{paragraph.children}</p>
        }, // paragraph  

        code(codeTag) {
            const { className, children } = codeTag;
            const language = className.split('-')[1]; // className is something like language-js => We need the "js" part here

            return <SyntaxHighlighter style={atomDark} language={language}>
                {children}
            </SyntaxHighlighter>
        }
    } // CustomComponents
    return <>
        <Head>
            <title>{title}</title>
        </Head>

        <PostDiv>
            <PostHeader>
                <PostTitle>{title}</PostTitle>
                <div style={{ display: 'flex' }}>
                    <IconDate className="stroke-primary" />
                    <address>&nbsp;<i>{dateFormatted}</i></address>
                </div>
                <div style={{ display: 'flex' }}>
                    <IconUser className="stroke-primary" />
                    <address>&nbsp;<i>{author}</i></address>
                </div>
                <Hr />
            </PostHeader>

            <ReactMarkdown components={CustomComponents}>
                {content}
            </ReactMarkdown>
        </PostDiv>
    </>
}