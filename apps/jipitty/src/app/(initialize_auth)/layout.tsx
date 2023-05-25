import {
	PrettyFloatingBlob,
	PrettyFloatingBlob2
} from "@/components/PrettyFloatingBlob"

export default async function AuthLayout({
	children
}: {
	children: React.ReactNode
}) {
	return (
		<>
			<PrettyFloatingBlob />
			<PrettyFloatingBlob2 />
			<div className="flex flex-1 flex-col justify-center py-8 lg:px-6 lg:px-8">
				{children}
			</div>
		</>
	)
}
