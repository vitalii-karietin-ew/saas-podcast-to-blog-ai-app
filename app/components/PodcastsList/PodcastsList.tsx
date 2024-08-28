import { Podcast } from "@/app/utils/types";
import Link from "next/link";

type Props = {
	podcasts: Podcast[];
	loading: boolean;
	completed: boolean;
};

export default function PodcastsList({
	podcasts,
	loading,
	completed
}: Props) {
	if(!loading && completed) {
		return (
			<>
				{
					podcasts.map((podcast: any) => (
						<div key={podcast.podcastGuid} className="mb-4">
							<Link
								href={`/podcast/${podcast.podcastGuid}/episodes`}
								className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
							>
								{podcast.image ? (
									<img className="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 min-w-48 md:rounded-none md:rounded-s-lg" src={podcast.image} alt=""/>
								) : (
									<div className="object-cover w-full rounded-t-lg h-48 md:w-48 min-w-48 md:rounded-none md:rounded-s-lg bg-gray-200 dark:bg-gray-700"></div>
								)}
								<div className="flex flex-col justify-between p-4 leading-normal">
									<h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{podcast.title}</h5>
									<p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{podcast.description}</p>
								</div>
							</Link>
						</div>
					))
				}
			</>
		)
	};
	return null;
}