import '../../styles/mapPage.css'
import { fetchMap, searchContent } from '@/app/api/content';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { ICreator, IFile, IContentDoc, ContentTypes } from '@/app/api/types';
import MapWrapper from '@/components/Content/ContentWrapper';
import { Metadata, ResolvingMetadata } from 'next';
import { sendLog } from '@/app/api/logging';
import { getI18n } from '@/locales/server';
import Content from '@/components/Content/Content';

export async function generateMetadata(
{ params }: {params: Params},
parent: ResolvingMetadata
): Promise<Metadata> {
    // read route params
    const id = params.id
   
    // fetch data
    const map: IContentDoc = await fetchMap(params.slug)

    if(!map || !map.images) return {
        title: "Map Not Found",
        openGraph: {
            title: "Map Not Found",
            description: "Map Not Found",
            images: [
            {
                url: "https://next.mccreations.net/images/logo.png"
            }
            ],
            siteName: "MCCreations",
            type: "article",
            url: "https://next.mccreations.net/maps/" + params.slug
        }
    }
   
    return {
      title: `${map.title} Map for Minecraft ${map.files[0].minecraftVersion} on MCCreations`,
      openGraph: {
        title: `${map.title} Map for Minecraft ${map.files[0].minecraftVersion} on MCCreations`,
        description: map.shortDescription,
        images: [
          ...map.images
        ],
        siteName: "MCCreations",
        type: "article",
        url: "https://next.mccreations.net/maps/" + map.slug
      }
    }
  }


export async function generateStaticParams() {
    const maps = (await searchContent({contentType: ContentTypes.Maps}, false)).documents
    return maps.map((map: IContentDoc) => ({
        slug: map.slug
    }))
}

export default async function Page({params}: {params: Params}) {
    const map = await fetchMap(params.slug)
    const t = await getI18n()
    
    if(map && '_id' in map) {
        return (
            <Content content={map} contentType={ContentTypes.Maps}/>
        )
    } else if (map) {
        return (
            <MapWrapper map={map} slug={params.slug}/>
        )
    } else {
        sendLog("Map Page", "")
        return (
            <div>
                <h1>{t('content.map_not_found')}</h1>
            </div>
        )
    }

}