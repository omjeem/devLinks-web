"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import PhonePreview from "@/components/PhonePreview";
import LinksCustomizer from "@/components/LinksCustomizer";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import AuthPage from "@/components/Auth";
import { Link, MEDIA_PLATEFORM, PageType, envConfig, platformRegexMap } from "@/lib/utils";
import toast from "react-hot-toast";
import axios from "axios";



export default function Home() {
  const [links, setLinks] = useState<Link[]>([]);
  const [pageType, setPageType] = useState<PageType>(PageType.SIGNUP)
  const [isPreview, setIsPreview] = useState(false)


  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const fetchUserLinks = async (token: string) => {
    try {
      const response = await axios.get(`${envConfig.backendUrl}/link`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      setLinks(response.data.data)
    } catch (error: any) {
      const message = error.response.data.error || "Error while fetching links"
      toast.error(message)
    }
  }

  useEffect(() => {
    const user = JSON.parse(String(localStorage.getItem("user")))
    if (user) {
      setPageType(PageType.LINKS)
      fetchUserLinks(user.token)
    }
  }, [])

  const addLink = () => {
    const newLink: Link = {
      id: `random-${Math.random().toString(36).substr(2, 9)}`,
      field: MEDIA_PLATEFORM.Github,
      value: "",
      error: ""
    };
    setLinks([...links, newLink]);
  };

  const removeLink = async (id: string) => {
    const removeUrl = (linkId: string) => {
      setLinks(links.filter((link) => link.id !== linkId));
    }
    if (id.startsWith('random')) {
      removeUrl(id)
      return
    }
    try {
      const user = JSON.parse(String(localStorage.getItem("user")))
      if (!user) {
        toast.error("Please logged in first")
        return;
      }
      const response = await axios.delete(`${envConfig.backendUrl}/link/${id}`, {
        headers: {
          "Authorization": `Bearer ${user.token}`
        }
      })
      console.log("Link deleted successfully", response.data)
      toast.success("Link Deleted Successfully")
      removeUrl(id)
    } catch (error: any) {
      const message = error?.response?.data?.error
      toast.error(message)
    }
  };

  const updateLink = (id: string, field: "field" | "value", value: string) => {
    setLinks(
      links.map((link) =>
        link.id === id ? { ...link, [field]: value } : link,
      ),
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setLinks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const onSave = async () => {
    let flag = false
    const errorLinks = links.map(link => {
      const pattern = platformRegexMap[link.field]
      const isValid = pattern.test(link.value)
      if (!isValid) {
        flag = true
      }
      return {
        ...link,
        error: isValid ? "" : `Invalid url for ${link.field}`
      }
    })
    setLinks(errorLinks)
    if (flag) {
      toast.error("Please make correct the url's")
      return;
    }
    const linksToAdd = links
      .filter(link => link.id.startsWith("random"))
      .map(l => {
        return {
          field: l.field,
          value: l.value
        }
      })

    const linksNotToAdd = links
      .filter(link => !link.id.startsWith("random"))
      .map(l => {
        return {
          id: l.id,
          field: l.field,
          value: l.value
        }
      })

    console.log("Links to add ", linksToAdd, "not to add", linksNotToAdd)
    try {
      const user = JSON.parse(String(localStorage.getItem("user")))
      if (!user) {
        toast.error("Please login first")
        return
      }
      const token = user.token
      const response = await axios.post(`${envConfig.backendUrl}/link`, linksToAdd, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      })
      const responseData = response.data.data
      console.log("Response data is ", responseData)
      console.log("Links not to add ", linksNotToAdd)
      const finalRes = [
        ...linksNotToAdd,
        ...responseData
      ]
      console.log("Response data is ", responseData, "final resi s", finalRes)
      toast.success("New Links Saved Successfully")
      setLinks(finalRes)

    } catch (error: any) {
      const message = error?.response?.data?.error
      toast.error(message)
    }
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <Header isPreview={isPreview} setIsPreview={setIsPreview} />
      <div className="flex-1 w-full flex max-sm:flex-col-reverse gap-6 p-6 max-w-[98vw] sm:max-w-[80vw] mx-auto scroll-smooth">
        <div className={`${!isPreview ? 'basis-2/5' : 'w-full'} bg-white w-full grid place-items-center`}>
          <div className="sticky top-6" id="phone-preview">
            <PhonePreview links={links} />
          </div>
        </div>
        {
          !isPreview && <div className="basis-3/5 self-stretch flex flex-col">
            {
              pageType === PageType.LINKS ? (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={links}
                    strategy={verticalListSortingStrategy}
                  >
                    <LinksCustomizer
                      links={links}
                      onAddLink={addLink}
                      onRemoveLink={removeLink}
                      onUpdateLink={updateLink}
                      onSave={onSave}
                    />
                  </SortableContext>
                </DndContext>
              ) : (
                <div>
                  <AuthPage pageType={pageType} setPageType={setPageType} />
                </div>
              )
            }
          </div>
        }
      </div>
    </div>
  );
}
