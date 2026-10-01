import { ButtonLink, Container, EmptyState } from "../components/ui";
import { SearchIcon } from "../components/Icons";

export function NotFoundPage() {
  return (
    <Container className="py-20 animate-fade-in">
      <EmptyState
        icon={<SearchIcon size={24} />}
        title="We couldn't find that page"
        description="The product or page you're looking for doesn't exist (or was removed from the catalogue)."
        action={<ButtonLink to="/">Back to home</ButtonLink>}
        className="mx-auto max-w-xl"
      />
    </Container>
  );
}
