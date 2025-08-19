import json
import sys

try:
    from nrclex import NRCLex
except Exception:
    NRCLex = None


def analyze(text: str):
    text = (text or "").strip()
    if not text:
        return {"top_emotion": "neutral", "scores": {}}

    if NRCLex is None:
        # Fallback neutral if NRCLex isn't installed
        return {"top_emotion": "neutral", "scores": {}}

    doc = NRCLex(text)
    scores = doc.raw_emotion_scores or {}
    # Map to a simplified set
    simplified = {
        "sadness": scores.get("sadness", 0),
        "happiness": scores.get("joy", 0),
        "anger": scores.get("anger", 0),
        "fear": scores.get("fear", 0),
        "disgust": scores.get("disgust", 0),
        "surprise": scores.get("surprise", 0),
        "trust": scores.get("trust", 0),
        "anticipation": scores.get("anticipation", 0),
    }
    top_emotion = "neutral"
    if simplified:
        top_emotion = max(simplified.items(), key=lambda kv: kv[1])[0]
        if simplified[top_emotion] == 0:
            top_emotion = "neutral"

    return {"top_emotion": top_emotion, "scores": simplified}


def main():
    if len(sys.argv) > 1:
        text = " ".join(sys.argv[1:])
    else:
        text = sys.stdin.read()
    result = analyze(text)
    print(json.dumps(result))


if __name__ == "__main__":
    main()


