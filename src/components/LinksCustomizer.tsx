import LinkItem from "./LinkItem";
import EmptyState from "./EmptyState";
import { Link, platformExampleUrlMap } from "@/lib/utils";

interface LinksCustomizerProps {
  links: Link[];
  onAddLink: () => void;
  onRemoveLink: (id: string) => void;
  onUpdateLink: (id: string, field: "field" | "value", value: string) => void;
  onSave: () => void
}

export default function LinksCustomizer({
  links,
  onAddLink,
  onRemoveLink,
  onUpdateLink,
  onSave
}: LinksCustomizerProps) {

  return (
    <div className="bg-white rounded-xl p-10 flex-1 flex flex-col">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Customize your links
        </h1>
        <p className="text-gray-500">
          Add/edit/remove links below and then share all your profiles with the
          world!
        </p>
      </div>

      <button
        onClick={onAddLink}
        className="w-full py-3 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors mb-6 font-medium"
      >
        + Add new link
      </button>

      {links.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-6 mb-10 flex-1 max-h-[50vh] overflow-auto">
          <div>
            {
              links.map((link, index) => (
                <LinkItem
                  key={link.id}
                  link={link}
                  index={index}
                  onRemove={() => onRemoveLink(link.id)}
                  onUpdate={(field, value) => onUpdateLink(link.id, field, value)}
                />
              ))
            }
          </div>
        </div>
      )}

      {
        links.length > 0 && <div className="border-t border-gray-200 pt-6 mt-auto">
          <button onClick={onSave} className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
            Save
          </button>
        </div>
      }

    </div>
  );
}
