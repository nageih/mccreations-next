import { CollectionNames, MinecraftVersion, SortOptions, StatusOptions, StatusStrings, TagCategories, TagKeys, Tags } from "@/app/api/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { DownloadCloud, Filter } from "react-feather";
import SecondaryButton from "../Buttons/SecondaryButton";
import styles from './index.module.css'
import MainButton from "../Buttons/MainButton";
import WarningButton from "../Buttons/WarningButton";
import FormComponent from "../Form/Form";
import { fetchTags } from "@/app/api/content";
import IconButton from "../Buttons/IconButton";
import BulkDownloadButton from "../Buttons/BulkDownloadButton";
import {useTranslations} from 'next-intl';

export default function SearchAndFilter({callback, contentType}: {callback: Function, contentType: CollectionNames}) {
    const searchParams = useSearchParams()
    const [filtering, setFiltering] = useState(false);
    const [tags, setTags] = useState<{[key: string]: string[]}>()

    const [search, setSearch] = useState("")

    const [popupOpen, setPopupOpen] = useState(false)

    const [sortDropdown, setSortDropdown] = useState(false)
    const [sort, setSort] = useState<SortOptions>();

    const [statusDropdown, setStatusDropdown] = useState(false)
    const [status, setStatus] = useState(StatusOptions.Approved)

    const [tagsDropdown, setTagsDropdown] = useState(false)
    const [includeTags, setIncludeTags] = useState<string[]>([])
    const [excludeTags, setExcludeTags] = useState<string[]>([])

    const router = useRouter();
    const t = useTranslations()

    useEffect(() => {

        fetchTags(contentType).then((data) => {
            if('genre' in data) {
                setTags(data)
            }
        })

        if(searchParams.get("search") && searchParams.get("search") != search) {
            setSearch(searchParams.get("search") + "")
        }
        if(searchParams.get("sort") && searchParams.get("sort") != sort) {
            setSort(searchParams.get("sort")! as SortOptions)
        }
        if(searchParams.get("status")&& Number.parseInt(searchParams.get("status")!) != status) {
            setStatus(Number.parseInt(searchParams.get("status")!))
        }

    }, [])

    const Tag = ({tag, tagValue}: {tag: string, tagValue: string}) => {
        return (
            <div className={`${styles.tag} ${(includeTags.includes(tagValue)) ? styles.include : ""} ${(excludeTags.includes(tagValue)) ? styles.exclude : ""}`} onClick={() => {
                if(includeTags.includes(tagValue)) {
                    setIncludeTags(includeTags.filter((t) => t != tagValue))
                    setExcludeTags([...excludeTags, tagValue])
                } else if(excludeTags.includes(tagValue)) {
                    setExcludeTags(excludeTags.filter((t) => t != tagValue))
                } else {
                    setIncludeTags([...includeTags, tagValue])
                }
            }}>
                {tag}
            </div>
        )
    }

    const closePopups = () => {
        setSortDropdown(false);
        setStatusDropdown(false);
        setTagsDropdown(false);
        setPopupOpen(false)
    }

    // useEffect(() => {
    //     callback(search, sort, status);
    // }, [search, sort, status])

    const updateSearch = (search: string) => {
        setSearch(search);
        router.push(`?search=${search}&sort=${sort}&status=${status}&include=${includeTags.join(",")}&exclude=${excludeTags.join(",")}`)
    }

    const updateSort = (sort: SortOptions) => {
        router.push(`?search=${search}&sort=${sort}&status=${status}&include=${includeTags.join(",")}&exclude=${excludeTags.join(",")}`)
        setSort(sort);
    }

    const updateStatus = (status: StatusOptions) => {
        router.push(`?search=${search}&sort=${sort}&status=${status}&include=${includeTags.join(",")}&exclude=${excludeTags.join(",")}`)
        setStatus(status);
    }

    const updateTags = () => {
        router.push(`?search=${search}&sort=${sort}&status=${status}&include=${includeTags.join(",")}&exclude=${excludeTags.join(",")}`)
    }

    const performSearch = () => {
        updateSearch(search);
        updateSort(sort!);
        updateStatus(status!);
        updateTags();
        callback(search, sort, status, includeTags, excludeTags);
    }

    return (
        <div className="search_and_filter">
            <div className={styles.fullscreen} style={{display: (popupOpen) ? "block": "none"}} onClick={() => {(popupOpen == true) ? closePopups(): false}}></div>
                <div className="search_stack">
                    <input type="text" placeholder={t('SearchAndFilter.search_placeholder')} className="search" defaultValue={(search) ? search : ""} onChange={(e) => {setSearch(e.target.value)}} onKeyDown={(e) => (e.key === "Enter") ? performSearch() : false}></input>
                    <BulkDownloadButton />
                </div>
                <div className="filters">
                    <div className="filter_option">
                        {t('SearchAndFilter.sort_by')} 
                        <div className="select" onClick={() => {setSortDropdown(true); setPopupOpen(true)}}>
                            <button className="selected_option">{(sort) ? t(`SearchAndFilter.Sort.${sort}`) : t('SearchAndFilter.Sort.newest')}</button>
                            <div className={(sortDropdown) ? "options active" : "options"}>
                                <div className={(sort === SortOptions.Newest) ? "option selected": "option"} onClick={() => updateSort(SortOptions.Newest)}>{t('SearchAndFilter.Sort.newest')}</div>
                                <div className={(sort === SortOptions.Oldest) ? "option selected": "option"} onClick={() => updateSort(SortOptions.Oldest)}>{t('SearchAndFilter.Sort.oldest')}</div>
                                <div className={(sort === SortOptions.Updated) ? "option selected": "option"} onClick={() => updateSort(SortOptions.Updated)}>{t('SearchAndFilter.Sort.updated')}</div>
                                <div className={(sort === SortOptions.HighestRated) ? "option selected": "option"} onClick={() => updateSort(SortOptions.HighestRated)}>{t('SearchAndFilter.Sort.highest_rated')}</div>
                                <div className={(sort === SortOptions.LowestRated) ? "option selected": "option"} onClick={() => updateSort(SortOptions.LowestRated)}>{t('SearchAndFilter.Sort.lowest_rated')}</div>
                                <div className={(sort === SortOptions.HighestDownloads) ? "option selected": "option"} onClick={() => updateSort(SortOptions.HighestDownloads)}>{t('SearchAndFilter.Sort.highest_downloads')}</div>
                                <div className={(sort === SortOptions.LowestDownloads) ? "option selected": "option"} onClick={() => updateSort(SortOptions.LowestDownloads)}>{t('SearchAndFilter.Sort.lowest_downloads')}</div>
                                <div className={(sort === SortOptions.TitleAscending) ? "option selected": "option"} onClick={() => updateSort(SortOptions.TitleAscending)}>{t('SearchAndFilter.Sort.title_ascending')}</div>
                                <div className={(sort === SortOptions.TitleDescending) ? "option selected": "option"} onClick={() => updateSort(SortOptions.TitleDescending)}>{t('SearchAndFilter.Sort.title_descending')}</div>
                                <div className={(sort === SortOptions.CreatorAscending) ? "option selected": "option"} onClick={() => updateSort(SortOptions.CreatorAscending)}>{t('SearchAndFilter.Sort.creator_ascending')}</div>
                                <div className={(sort === SortOptions.CreatorDescending) ? "option selected": "option"} onClick={() => updateSort(SortOptions.CreatorDescending)}>{t('SearchAndFilter.Sort.creator_descending')}</div>
                            </div>
                        </div>
                    </div>
                    <div className="filter_option">
                        {t('SearchAndFilter.status')}
                        <div className="select" onClick={() => {setStatusDropdown(true); setPopupOpen(true)}}>
                            <button className="selected_option">{t(`Status.${(StatusOptions[status] === "Unapproved") ? "unapproved" : (StatusOptions[status] === "Approved") ? "approved" : "featured"}`)}</button>
                            <div className={(statusDropdown) ? "options active" : "options"}>
                                <div className={(status === StatusOptions.Unapproved) ? "option selected": "option"} onClick={() => updateStatus(StatusOptions.Unapproved)}>{t('Status.unapproved')}</div>
                                <div className={(status === StatusOptions.Approved) ? "option selected": "option"} onClick={() => updateStatus(StatusOptions.Approved)}>{t('Status.approved')}</div>
                                <div className={(status === StatusOptions.Featured) ? "option selected": "option"} onClick={() => updateStatus(StatusOptions.Featured)}>{t('Status.featured')}</div>
                            </div>
                        </div>
                    </div>
                    <div className="filter_option">
                        {t('SearchAndFilter.tags')}
                        <div className="select" onClick={() => {setTagsDropdown(true); setPopupOpen(true)}}>
                            <button className="selected_option">{t('SearchAndFilter.tags')}</button>
                            <div className={(tagsDropdown) ? `options active ${styles.wide}` : "options"}>
                                <div>
                                    {tags && Object.keys(tags).map((category, idx) => {
                                        return (
                                            <div key={idx}>
                                                <h4>{t(`Content.Tags.${category as TagCategories}`)}</h4>
                                                <div className={styles.tags_list}>
                                                    {tags[category].map((tag,idx) => <Tag key={idx} tagValue={tag} tag={t(`Content.Tags.${tag as TagKeys}`)} />)}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.search_buttons}>
                    <MainButton className={`${styles.search_button}`} onClick={() => performSearch()}>{t('SearchAndFilter.search')}</MainButton>
                    <WarningButton onClick={() => {updateSearch(""); updateSort(SortOptions.Newest); updateStatus(2); setExcludeTags([]); setIncludeTags([])}}>{t('SearchAndFilter.clear_filters')}</WarningButton>
                </div>
            </div>
    )
}