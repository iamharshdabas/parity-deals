import { siteData } from "@/config/site";
import { ProductBannerSchema } from "@/schema/product";

export default function Banner({
  message,
  canRemoveBranding,
  mappings,
  customizations,
}: ProductBannerSchema) {
  const prefix = customizations.classPrefix ?? "";
  const mappedMessage = Object.entries(mappings).reduce(
    (mappedMessage, [key, value]) => {
      return mappedMessage.replace(new RegExp(`{${key}}`, "g"), String(value));
    },
    message.replace(/'/g, "&#39;"),
  );

  return (
    <>
      <style type="text/css">
        {`
          .${prefix}-container {
            all: revert;
            display: flex;
            flex-direction: column;
            gap: 0.5em;
            background-color: ${customizations.backgroundColor};
            color: ${customizations.textColor};
            font-size: ${customizations.fontSize};
            font-family: inherit;
            padding: 1rem;
            ${customizations.isSticky ? "position: sticky;" : ""}
            left: 0;
            right: 0;
            top: 0;
            text-wrap: balance;
            text-align: center;
          }

          .${prefix}-branding {
            color: inherit;
            font-size: inherit;
            display: inline-block;
            text-decoration: underline;
          }
        `}
      </style>

      <div className={`${prefix}-container ${prefix}-container-override`}>
        <span
          className={`${prefix}-message ${prefix}-message-override`}
          dangerouslySetInnerHTML={{
            __html: mappedMessage,
          }}
        />
        {!canRemoveBranding && (
          <a
            className={`${prefix}-branding`}
            // BUG: can't use lib/env.ts here.
            href={`${process.env.NEXT_PUBLIC_SITE_URL}`}
          >
            Powered by {siteData.title}
          </a>
        )}
      </div>
    </>
  );
}
